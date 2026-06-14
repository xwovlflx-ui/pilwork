import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { AccessTokenPayload } from "./auth.types.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const publicKeyPath = config.getOrThrow<string>("JWT_PUBLIC_KEY_PATH");
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync(resolve(publicKeyPath), "utf8"),
      algorithms: ["RS256"],
      issuer: "fillwork-api",
      audience: "fillwork-web",
    });
  }

  validate(payload: AccessTokenPayload) {
    return payload;
  }
}
