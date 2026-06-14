export type AuthRole = "SUPER_ADMIN" | "ORG_ADMIN" | "MANAGER" | "MEMBER" | "GUEST";

export type AuthStatus = "pending" | "active" | "suspended";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  organization: string;
  inviteCode?: string;
  role: AuthRole;
  status: AuthStatus;
  createdAt: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
  organization: string;
  inviteCode?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

