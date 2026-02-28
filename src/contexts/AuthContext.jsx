import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { LS_KEYS } from '../storage/keys.js';
import { readJSON, writeJSON } from '../storage/json.js';
import { ensureSeeded } from '../storage/seed.js';

const AuthContext = createContext(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

function roleDashboardPath(role) {
  return `/${role}/dashboard`;
}

function pushActivity(evt) {
  const current = readJSON(LS_KEYS.activity, []);
  const next = {
    id: `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    at: new Date().toISOString(),
    ...evt,
  };
  writeJSON(LS_KEYS.activity, [next, ...current].slice(0, 250));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    ensureSeeded();
    const session = readJSON(LS_KEYS.session, null);
    if (!session?.userId) return;
    const users = readJSON(LS_KEYS.users, []);
    const found = users.find((u) => u.id === session.userId) ?? null;
    setUser(found);
  }, []);

  const api = useMemo(
    () => ({
      user,
      roleDashboardPath,
      login: (email, password) => {
        ensureSeeded();
        const users = readJSON(LS_KEYS.users, []);
        const found = users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );
        if (!found) return { ok: false, error: 'Invalid email or password.' };
        setUser(found);
        writeJSON(LS_KEYS.session, { userId: found.id });
        pushActivity({ type: 'auth.login', userId: found.id, meta: { role: found.role } });
        return { ok: true, user: found };
      },
      logout: () => {
        const current = user;
        setUser(null);
        localStorage.removeItem(LS_KEYS.session);
        pushActivity({ type: 'auth.logout', userId: current?.id });
      },
      signup: ({ name, email, password, role }) => {
        ensureSeeded();
        const users = readJSON(LS_KEYS.users, []);
        const exists = users.some(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (exists) return { ok: false, error: 'An account with this email already exists.' };
        const newUser = {
          id: `u_${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          createdAt: new Date().toISOString(),
        };
        const next = [newUser, ...users];
        writeJSON(LS_KEYS.users, next);
        writeJSON(LS_KEYS.session, { userId: newUser.id });
        setUser(newUser);
        pushActivity({ type: 'auth.signup', userId: newUser.id, meta: { role } });
        return { ok: true, user: newUser };
      },
    }),
    [user]
  );

  // ✅ Wrap children in provider
  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}