import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authService from "../services/auth.service.js";
import { clearAuthToken, getStoredToken } from "../services/api.js";

const AuthContext = createContext(null);

/**
 * AuthProvider — owns session state for Creator Studio.
 * Boots by reading stored token + GET /auth/profile.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(() => Boolean(getStoredToken()));
  const [error, setError] = useState(null);

  const refreshProfile = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      return null;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
      setError(null);
      return profile;
    } catch {
      clearAuthToken();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!getStoredToken()) {
      setBootstrapping(false);
      return undefined;
    }

    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    (async () => {
      try {
        const profile = await authService.getProfile({ signal: controller.signal });
        if (active) setUser(profile);
      } catch {
        clearAuthToken();
        if (active) setUser(null);
      } finally {
        clearTimeout(timeout);
        setBootstrapping(false);
      }
    })();

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const login = useCallback(async ({ email, password, rememberMe }) => {
    setError(null);
    const data = await authService.login({ email, password, rememberMe });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapping,
      error,
      login,
      logout,
      refreshProfile,
    }),
    [user, bootstrapping, error, login, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export default AuthContext;
