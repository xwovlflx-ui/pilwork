import { IsIn } from "class-validator";
import { Role } from "../../generated/prisma/client.js";

export class ApproveMembershipDto {
  @IsIn([Role.ORG_ADMIN, Role.MANAGER, Role.MEMBER, Role.GUEST])
  role!: Role;
}

