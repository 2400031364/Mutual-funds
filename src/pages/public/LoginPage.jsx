import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';
import { TextField } from '../../components/ui/Input/Input';
import { useAuth } from '../../contexts/AuthContext';
import { LS_KEYS } from '../../storage/keys';
import { readJSON } from '../../storage/json';
import { ensureSeeded } from '../../storage/seed';
import styles from './LoginPage.module.css';

function roleLabel(role) {
  switch (role) {
    case 'admin': return 'Admin';
    case 'investor': return 'Investor';
    case 'advisor': return 'Financial Advisor';
    case 'analyst': return 'Data Analyst';
    default: return '';
  }
}

export default function LoginPage() {
  const { login, roleDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const detected = useMemo(() => {
    ensureSeeded();
    const users = readJSON(LS_KEYS.users, []);
    return users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    ) ?? null;
  }, [email, password]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const res = login(email, password);
    if (!res.ok) return setError(res.error);

    const from = location.state?.from;
    navigate(from || roleDashboardPath(res.user.role), { replace: true });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in to access your dashboard. Role is auto-detected.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={onSubmit} className={styles.form}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            hint={detected ? `Detected role: ${roleLabel(detected.role)}` : undefined}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" className={styles.loginButton}>Login</Button>
        </form>

        <div className={styles.links}>
          <Link to="/signup" className={styles.link}>Don't have an account? Signup</Link>
          <Link to="/funds" className={styles.link}>Browse funds</Link>
        </div>

        <div className={styles.demo}>
          <h3>Demo Credentials</h3>
          <div className={styles.demoRow}><span className={styles.demoRole}>Admin:</span> admin@mf.com / admin123</div>
          <div className={styles.demoRow}><span className={styles.demoRole}>Investor:</span> investor@mf.com / investor123</div>
          <div className={styles.demoRow}><span className={styles.demoRole}>Advisor:</span> advisor@mf.com / advisor123</div>
          <div className={styles.demoRow}><span className={styles.demoRole}>Analyst:</span> analyst@mf.com / analyst123</div>
        </div>
      </div>
    </div>
  );
}