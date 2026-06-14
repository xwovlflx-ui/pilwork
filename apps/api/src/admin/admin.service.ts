import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { MembershipStatus, type Role } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import type { RequestUser } from "../auth/auth.types.js";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listPending(actor: RequestUser) {
    const memberships = await this.prisma.membership.findMany({
      where: { organizationId: actor.org, status: MembershipStatus.PENDING },
      include: { user: true, organization: true },
      orderBy: { createdAt: "asc" },
    });
    return memberships.map((membership) => ({
      id: membership.id,
      name: membership.user.name,
      email: membership.user.email,
      organization: membership.organization.name,
      role: membership.role,
      status: "pending" as const,
      createdAt: membership.user.createdAt.toISOString(),
    }));
  }

  async approve(actor: RequestUser, membershipId: string, role: Role, meta: { ipAddress?: string; userAgent?: string }) {
    const membership = await this.prisma.membership.findFirst({
      where: { id: membershipId, organizationId: actor.org, status: MembershipStatus.PENDING },
      include: { user: true, organization: true },
    });
    if (!membership) throw new NotFoundException("승인 대상을 찾을 수 없습니다.");

    const approved = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.membership.update({
        where: { id: membership.id },
        data: {
          role,
          status: MembershipStatus.ACTIVE,
          approvedById: actor.sub,
          approvedAt: new Date(),
          rejectedAt: null,
          statusReason: null,
        },
        include: { user: true, organization: true },
      });
      await tx.auditLog.create({
        data: {
          organizationId: actor.org,
          actorId: actor.sub,
          action: "MEMBERSHIP_APPROVED",
          resourceType: "Membership",
          resourceId: membership.id,
          before: { role: membership.role, status: membership.status },
          after: { role, status: MembershipStatus.ACTIVE },
          ipAddress: normalizeIp(meta.ipAddress),
          userAgent: meta.userAgent,
          requestId: randomUUID(),
        },
      });
      return updated;
    });

    return {
      id: approved.id,
      name: approved.user.name,
      email: approved.user.email,
      organization: approved.organization.name,
      role: approved.role,
      status: "active" as const,
      createdAt: approved.user.createdAt.toISOString(),
    };
  }
}

function normalizeIp(value?: string) {
  if (!value) return undefined;
  return value.startsWith("::ffff:") ? value.slice(7) : value;
}

