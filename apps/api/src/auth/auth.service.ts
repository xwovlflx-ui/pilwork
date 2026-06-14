import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { hash, verify } from "argon2";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MembershipStatus,
  Role,
  UserStatus,
  type Membership,
  type Organization,
  type User,
} from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type { AccessTokenPayload, RequestUser } from "./auth.types.js";
import type { LoginDto } from "./dto/login.dto.js";
import type { RegisterDto } from "./dto/register.dto.js";

type MembershipWithOrganization = Membership & { organization: Organization };
type SessionMeta = { ipAddress?: string; userAgent?: string };

@Injectable()
export class AuthService {
  private readonly privateKey: string;
  private readonly accessTokenSeconds: number;
  private readonly refreshTokenDays: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    config: ConfigService,
  ) {
    this.privateKey = readFileSync(resolve(config.getOrThrow<string>("JWT_PRIVATE_KEY_PATH")), "utf8");
    this.accessTokenSeconds = parseDurationSeconds(config.get<string>("ACCESS_TOKEN_TTL", "15m"));
    this.refreshTokenDays = Number(config.get<string>("REFRESH_TOKEN_DAYS", "30"));
  }

  async login(input: LoginDto, meta: SessionMeta) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email.trim().toLowerCase() },
      include: { memberships: { include: { organization: true }, orderBy: { createdAt: "asc" } } },
    });

    if (!user?.passwordHash || !(await verify(user.passwordHash, input.password))) {
      throw new UnauthorizedException("이메일 또는 비밀번호를 확인해 주세요.");
    }
    if (user.status !== UserStatus.ACTIVE || user.deletedAt) {
      throw new UnauthorizedException("정지되었거나 사용할 수 없는 계정입니다.");
    }

    const membership = user.memberships[0];
    if (!membership) throw new UnauthorizedException("소속 조직을 찾을 수 없습니다.");

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.createSession(user, membership, meta);
  }

  async register(input: RegisterDto, meta: SessionMeta) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("이미 가입된 이메일입니다.");

    const passwordHash = await hash(input.password, { type: 2 });
    const organizationName = input.organization.trim();
    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.findFirst({
        where: { name: { equals: organizationName, mode: "insensitive" }, deletedAt: null },
      }) ?? await tx.organization.create({
        data: { name: organizationName, slug: `org-${randomUUID().slice(0, 8)}` },
      });
      const user = await tx.user.create({
        data: { name: input.name.trim(), email, passwordHash, status: UserStatus.ACTIVE },
      });
      const membership = await tx.membership.create({
        data: {
          organizationId: organization.id,
          userId: user.id,
          role: input.inviteCode?.trim().toUpperCase() === "FIELD26" ? Role.MEMBER : Role.GUEST,
          status: MembershipStatus.PENDING,
        },
        include: { organization: true },
      });
      return { user, membership };
    });

    return this.createSession(result.user, result.membership, meta);
  }

  async refresh(refreshToken: string | undefined, meta: SessionMeta) {
    if (!refreshToken) throw new UnauthorizedException("Refresh Token이 없습니다.");
    const [sessionId] = refreshToken.split(".");
    if (!sessionId) throw new UnauthorizedException("잘못된 Refresh Token입니다.");

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        membership: { include: { organization: true } },
      },
    });
    const tokenMatches = session?.refreshTokenHash === digest(refreshToken);
    if (!session || !tokenMatches || session.revokedAt || session.expiresAt <= new Date()) {
      if (session && !tokenMatches) {
        await this.prisma.session.updateMany({
          where: { familyId: session.familyId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }
      throw new UnauthorizedException("Refresh Token이 만료되었거나 폐기되었습니다.");
    }
    if (session.user.status !== UserStatus.ACTIVE) throw new UnauthorizedException("사용할 수 없는 계정입니다.");

    const nextRefreshToken = `${session.id}.${randomBytes(48).toString("base64url")}`;
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: digest(nextRefreshToken),
        lastUsedAt: new Date(),
        ipAddress: normalizeIp(meta.ipAddress),
        userAgent: meta.userAgent,
      },
    });

    return {
      token: await this.issueAccessToken(session.user, session.membership),
      refreshToken: nextRefreshToken,
      user: toAuthUser(session.user, session.membership),
    };
  }

  async logout(refreshToken?: string) {
    const sessionId = refreshToken?.split(".")[0];
    if (sessionId) {
      await this.prisma.session.updateMany({
        where: { id: sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
  }

  async getMe(actor: RequestUser) {
    const membership = await this.prisma.membership.findFirst({
      where: { id: actor.membership, userId: actor.sub, organizationId: actor.org },
      include: { user: true, organization: true },
    });
    if (!membership || membership.user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("현재 로그인 정보를 확인할 수 없습니다.");
    }
    return toAuthUser(membership.user, membership);
  }

  private async createSession(user: User, membership: MembershipWithOrganization, meta: SessionMeta) {
    const sessionId = randomUUID();
    const refreshToken = `${sessionId}.${randomBytes(48).toString("base64url")}`;
    const expiresAt = new Date(Date.now() + this.refreshTokenDays * 86_400_000);
    await this.prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        membershipId: membership.id,
        familyId: randomUUID(),
        refreshTokenHash: digest(refreshToken),
        userAgent: meta.userAgent,
        ipAddress: normalizeIp(meta.ipAddress),
        expiresAt,
      },
    });

    return {
      token: await this.issueAccessToken(user, membership),
      refreshToken,
      user: toAuthUser(user, membership),
    };
  }

  private issueAccessToken(user: User, membership: Membership) {
    const payload: AccessTokenPayload = {
      sub: user.id,
      org: membership.organizationId,
      membership: membership.id,
      role: membership.role,
      status: membership.status,
      tokenVersion: user.tokenVersion,
    };
    return this.jwt.signAsync(payload, {
      privateKey: this.privateKey,
      algorithm: "RS256",
      expiresIn: this.accessTokenSeconds,
      issuer: "fillwork-api",
      audience: "fillwork-web",
      jwtid: randomUUID(),
    });
  }
}

function toAuthUser(user: User, membership: MembershipWithOrganization) {
  const status = user.status === UserStatus.SUSPENDED || membership.status === MembershipStatus.SUSPENDED
    ? "suspended"
    : membership.status === MembershipStatus.ACTIVE
      ? "active"
      : "pending";
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    organization: membership.organization.name,
    role: membership.role,
    status,
    createdAt: user.createdAt.toISOString(),
  };
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeIp(value?: string) {
  if (!value) return undefined;
  return value.startsWith("::ffff:") ? value.slice(7) : value;
}

function parseDurationSeconds(value: string) {
  const match = /^(\d+)(s|m|h|d)$/.exec(value.trim());
  if (!match) throw new Error(`Invalid ACCESS_TOKEN_TTL: ${value}`);
  const amount = Number(match[1]);
  return amount * ({ s: 1, m: 60, h: 3600, d: 86400 }[match[2]] ?? 1);
}
