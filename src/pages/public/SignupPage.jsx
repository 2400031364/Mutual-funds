import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button/Button';
import { SelectField, TextField } from '../../components/ui/Input/Input';
import { useAuth } from '../../contexts/AuthContext';
import styles from './SignupPage.module.css';

export default function SignupPage() {
  const { signup, roleDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('investor');
  const [error, setError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const res = signup({ name, email, password, role });
    if (!res.ok) return setError(res.error);

    navigate(roleDashboardPath(res.user.role), { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Your Account</h1>
        <p className={styles.subtitle}>
          Choose a role to preview your professional dashboard.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={onSubmit} className={styles.form}>
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />

          <SelectField
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="investor">Investor</option>
            <option value="advisor">Financial Advisor</option>
            <option value="analyst">Data Analyst</option>
          </SelectField>

          <Button type="submit" className={styles.signupButton}>Signup</Button>
        </form>

        <p className={styles.loginLink}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}