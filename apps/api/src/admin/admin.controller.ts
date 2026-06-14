import { Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { RequestUser } from "../auth/auth.types.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Role } from "../generated/prisma/client.js";
import { AdminService } from "./admin.service.js";
import { ApproveMembershipDto } from "./dto/approve-membership.dto.js";
import { Roles } from "./roles.decorator.js";
import { RolesGuard } from "./roles.guard.js";

@Controller("admin/memberships")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("pending")
  listPending(@CurrentUser() actor: RequestUser) {
    return this.admin.listPending(actor);
  }

  @Patch(":id/approve")
  approve(
    @CurrentUser() actor: RequestUser,
    @Param("id") membershipId: string,
    @Body() input: ApproveMembershipDto,
    @Req() request: Request,
  ) {
    return this.admin.approve(actor, membershipId, input.role, {
      ipAddress: request.ip,
      userAgent: request.get("user-agent"),
    });
  }
}

