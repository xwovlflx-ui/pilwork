import type { MembershipStatus, Role } from "../generated/prisma/client.js";

export type AccessTokenPayload = {
  sub: string;
  org: string;
  membership: string;
  role: Role;
  status: MembershipStatus;
  tokenVersion: number;
};

export type RequestUser = AccessTokenPayload;

