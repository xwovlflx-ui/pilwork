import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import type { Role } from "../generated/prisma/client.js";
import type { RequestUser } from "../auth/auth.types.js";
import { ROLES_KEY } from "./roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles?.length) return true;
    const request = context.switchToHttp().getRequest<Request & { user: RequestUser }>();
    if (request.user.status !== "ACTIVE" || !roles.includes(request.user.role)) {
      throw new ForbiddenException("관리자 권한이 필요합니다.");
    }
    return true;
  }
}

