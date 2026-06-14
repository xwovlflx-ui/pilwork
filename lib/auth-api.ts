import { mockAuthApi } from "@/lib/mock-auth-api";
import type { AuthRole, AuthSession, AuthUser, LoginInput, RegisterInput } from "@/types/auth";

type ApprovalRole = Exclude<AuthRole, "SUPER_ADMIN">;

export type AuthApi = {
  login: (input: LoginInput) => Promise<AuthSession>;
  googleLogin: () => Promise<AuthSession>;
  register: (input: RegisterInput) => Promise<AuthSession>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  getMe: () => Promise<AuthUser | null>;
  listPending: () => Promise<AuthUser[]>;
  approve: (userId: string, role?: ApprovalRole) => Promise<AuthUser>;
  resetDemo: () => Promise<void>;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const mode = process.env.NEXT_PUBLIC_AUTH_MODE === "database" ? "database" : "mock";
let accessToken: string | null = null;

async function request<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${apiUrl}/api${path}`, { ...init, headers, credentials: "include" });
  if (response.status === 401 && retry && path !== "/auth/refresh") {
    const refreshed = await refreshSession();
    if (refreshed) return request<T>(path, init, false);
  }
  if (!response.ok) throw new Error(await errorMessage(response));
  return response.json() as Promise<T>;
}

async function refreshSession(): Promise<AuthSession | null> {
  try {
    const response = await fetch(`${apiUrl}/api/auth/refresh`, { method: "POST", credentials: "include" });
    if (!response.ok) {
      accessToken = null;
      return null;
    }
    const session = await response.json() as AuthSession;
    accessToken = session.token;
    return session;
  } catch {
    accessToken = null;
    return null;
  }
}

const databaseAuthApi: AuthApi = {
  async login(input) {
    const session = await request<AuthSession>("/auth/login", { method: "POST", body: JSON.stringify(input) }, false);
    accessToken = session.token;
    return session;
  },
  async googleLogin() {
    throw new Error("Google 로그인은 OAuth 연동 단계에서 활성화됩니다.");
  },
  async register(input) {
    const session = await request<AuthSession>("/auth/register", { method: "POST", body: JSON.stringify(input) }, false);
    accessToken = session.token;
    return session;
  },
  async logout() {
    try {
      await request<{ success: boolean }>("/auth/logout", { method: "POST" }, false);
    } finally {
      accessToken = null;
    }
  },
  forgotPassword: (email) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }, false),
  async getMe() {
    if (!accessToken) {
      const session = await refreshSession();
      return session?.user ?? null;
    }
    try {
      return await request<AuthUser>("/auth/me");
    } catch {
      return null;
    }
  },
  listPending: () => request<AuthUser[]>("/admin/memberships/pending"),
  approve: (membershipId, role = "MEMBER") => request<AuthUser>(`/admin/memberships/${membershipId}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  }),
  async resetDemo() {
    await databaseAuthApi.logout();
    await mockAuthApi.resetDemo();
  },
};

export const authApi: AuthApi = mode === "database" ? databaseAuthApi : mockAuthApi;
export const authMode = mode;

async function errorMessage(response: Response) {
  try {
    const payload = await response.json() as { message?: string | string[] };
    if (Array.isArray(payload.message)) return payload.message.join(" ");
    return payload.message ?? "요청을 처리하지 못했습니다.";
  } catch {
    return "서버에 연결할 수 없습니다.";
  }
}
