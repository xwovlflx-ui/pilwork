import type { AuthRole, AuthSession, AuthUser, LoginInput, RegisterInput } from "@/types/auth";

const USERS_KEY = "fillwork.mock.users.v1";
const SESSION_KEY = "fillwork.mock.session.v1";

type StoredUser = AuthUser & { password?: string };

const seedUsers: StoredUser[] = [
  { id: "usr-super", name: "서비스 관리자", email: "super@fillwork.kr", organization: "FillWork 운영팀", role: "SUPER_ADMIN", status: "active", createdAt: "2026-05-10T09:00:00.000Z" },
  { id: "usr-admin", name: "김서현", email: "admin@fillwork.kr", organization: "필워크 주식회사", role: "ORG_ADMIN", status: "active", createdAt: "2026-05-13T09:00:00.000Z" },
  { id: "usr-field-1", name: "김지연", email: "field1@fillwork.kr", organization: "필워크 주식회사", role: "MEMBER", status: "active", createdAt: "2026-05-14T09:00:00.000Z" },
  { id: "usr-field-2", name: "박민수", email: "field2@fillwork.kr", organization: "필워크 주식회사", role: "MEMBER", status: "active", createdAt: "2026-05-15T09:00:00.000Z" },
  { id: "usr-field-3", name: "이서연", email: "field3@fillwork.kr", organization: "필워크 주식회사", role: "MEMBER", status: "active", createdAt: "2026-05-16T09:00:00.000Z" },
  { id: "usr-manager", name: "박민수", email: "manager@fillwork.kr", organization: "필워크 주식회사", role: "MANAGER", status: "active", createdAt: "2026-05-20T09:00:00.000Z" },
  { id: "usr-member", name: "이지연", email: "member@fillwork.kr", organization: "필워크 주식회사", role: "MEMBER", status: "active", createdAt: "2026-05-22T09:00:00.000Z" },
  { id: "usr-guest", name: "현장 협력자", email: "guest@fillwork.kr", organization: "필워크 주식회사", role: "GUEST", status: "active", createdAt: "2026-06-01T09:00:00.000Z" },
  { id: "usr-pending", name: "최도윤", email: "pending@fillwork.kr", organization: "필워크 주식회사", role: "MEMBER", status: "pending", createdAt: "2026-06-12T08:30:00.000Z" },
];

function isBrowser() {
  return typeof window !== "undefined";
}

function delay(ms = 420) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitize(user: StoredUser): AuthUser {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function readUsers(): StoredUser[] {
  if (!isBrowser()) return seedUsers;
  const stored = window.localStorage.getItem(USERS_KEY);
  if (!stored) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  try {
    return JSON.parse(stored) as StoredUser[];
  } catch {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
}

function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createToken(user: AuthUser) {
  const payload = window.btoa(unescape(encodeURIComponent(JSON.stringify({ sub: user.id, role: user.role, status: user.status, exp: Date.now() + 86_400_000 }))));
  return `mock.${payload}.fillwork`;
}

function saveSession(session: AuthSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getStoredSession(): AuthSession | null {
  if (!isBrowser()) return null;
  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value ? JSON.parse(value) as AuthSession : null;
  } catch {
    return null;
  }
}

export const mockAuthApi = {
  async login(input: LoginInput): Promise<AuthSession> {
    await delay();
    const email = input.email.trim().toLowerCase();
    const user = readUsers().find((item) => item.email.toLowerCase() === email);
    if (!user) throw new Error("이메일 또는 비밀번호를 확인해 주세요.");
    const passwordIsValid = user.password ? user.password === input.password : input.password.trim().length >= 8;
    if (!passwordIsValid) throw new Error("이메일 또는 비밀번호를 확인해 주세요.");
    if (user.status === "suspended") throw new Error("정지된 계정입니다. 조직 관리자에게 문의해 주세요.");
    const safeUser = sanitize(user);
    const session = { token: createToken(safeUser), user: safeUser };
    saveSession(session);
    return session;
  },

  async googleLogin(): Promise<AuthSession> {
    await delay(520);
    const user = readUsers().find((item) => item.email === "member@fillwork.kr") ?? seedUsers[3];
    const safeUser = sanitize(user);
    const session = { token: createToken(safeUser), user: safeUser };
    saveSession(session);
    return session;
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    await delay(560);
    const users = readUsers();
    const email = input.email.trim().toLowerCase();
    if (users.some((item) => item.email.toLowerCase() === email)) throw new Error("이미 가입된 이메일입니다.");
    const user: StoredUser = {
      id: `usr-${Date.now()}`,
      name: input.name.trim(),
      email,
      organization: input.organization.trim(),
      inviteCode: input.inviteCode?.trim() || undefined,
      role: input.inviteCode?.trim().toUpperCase() === "FIELD26" ? "MEMBER" : "GUEST",
      status: "pending",
      password: input.password,
      createdAt: new Date().toISOString(),
    };
    writeUsers([user, ...users]);
    const safeUser = sanitize(user);
    const session = { token: createToken(safeUser), user: safeUser };
    saveSession(session);
    return session;
  },

  async logout() {
    await delay(180);
    if (isBrowser()) window.localStorage.removeItem(SESSION_KEY);
  },

  async forgotPassword(_email: string) {
    await delay(520);
    return { message: "가입된 계정이라면 비밀번호 재설정 안내를 발송했습니다." };
  },

  async getMe(): Promise<AuthUser | null> {
    await delay(160);
    const session = getStoredSession();
    if (!session) return null;
    const stored = readUsers().find((item) => item.id === session.user.id);
    if (!stored) return null;
    const user = sanitize(stored);
    saveSession({ token: createToken(user), user });
    return user;
  },

  async listPending(): Promise<AuthUser[]> {
    await delay(220);
    return readUsers().filter((item) => item.status === "pending").map(sanitize);
  },

  async approve(userId: string, role: Exclude<AuthRole, "SUPER_ADMIN"> = "MEMBER"): Promise<AuthUser> {
    await delay(360);
    const users = readUsers();
    const index = users.findIndex((item) => item.id === userId);
    if (index < 0) throw new Error("승인 대상을 찾을 수 없습니다.");
    users[index] = { ...users[index], role, status: "active" };
    writeUsers(users);
    return sanitize(users[index]);
  },

  async resetDemo(): Promise<void> {
    await delay(180);
    if (!isBrowser()) return;
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith("fillwork."))
      .forEach((key) => window.localStorage.removeItem(key));
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  },
};

export const authDemoAccounts = [
  { role: "관리자 · 김서현", email: "admin@fillwork.kr" },
  { role: "현장 기사 · 김지연", email: "field1@fillwork.kr" },
  { role: "현장 기사 · 박민수", email: "field2@fillwork.kr" },
  { role: "현장 기사 · 이서연", email: "field3@fillwork.kr" },
] as const;

export const authDemoPassword = "";
