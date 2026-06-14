"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi } from "@/lib/auth-api";
import type { AuthSession, AuthUser, LoginInput, RegisterInput } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function roleHome(user: Pick<AuthUser, "role" | "status">) {
  if (user.status !== "active") return "/auth/pending";
  return user.role === "SUPER_ADMIN" || user.role === "ORG_ADMIN" ? "/admin" : "/";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const current = await authApi.getMe();
    setUser(current);
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const acceptSession = useCallback((session: AuthSession) => {
    setUser(session.user);
    return session.user;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: async (input) => acceptSession(await authApi.login(input)),
    loginWithGoogle: async () => acceptSession(await authApi.googleLogin()),
    register: async (input) => acceptSession(await authApi.register(input)),
    logout: async () => {
      await authApi.logout();
      setUser(null);
    },
    refreshUser,
  }), [acceptSession, loading, refreshUser, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

const publicPaths = new Set(["/login", "/register", "/forgot-password", "/offline"]);
const adminRoles = new Set(["SUPER_ADMIN", "ORG_ADMIN"]);

export function AuthRouteGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (publicPaths.has(pathname)) {
      if (user) router.replace(roleHome(user));
      return;
    }
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.status !== "active" && pathname !== "/auth/pending") {
      router.replace("/auth/pending");
      return;
    }
    if (user.status === "active" && pathname === "/auth/pending") {
      router.replace(roleHome(user));
      return;
    }
    if (pathname.startsWith("/admin") && !adminRoles.has(user.role)) router.replace("/");
  }, [loading, pathname, router, user]);

  const publicPage = publicPaths.has(pathname);
  const pendingPage = pathname === "/auth/pending";
  const adminBlocked = pathname.startsWith("/admin") && user && !adminRoles.has(user.role);
  const canRender = publicPage ? !user : Boolean(user && (pendingPage || user.status === "active") && !adminBlocked);

  if (loading || !canRender) {
    return <div className="auth-loading"><span>F</span><strong>FillWork</strong><i /></div>;
  }
  return children;
}
