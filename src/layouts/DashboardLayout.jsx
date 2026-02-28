import { useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from './DashboardLayout.module.css';
import { useAuth } from '../contexts/AuthContext.jsx';

function roleLabel(role) {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'investor':
      return 'Investor';
    case 'advisor':
      return 'Financial Advisor';
    case 'analyst':
      return 'Data Analyst';
    default:
      return '';
  }
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? 'U').toUpperCase() +
    (parts[1]?.[0] ?? '').toUpperCase()
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();

  const nav = useMemo(() => {
    if (!user) return [];
    return [
      { to: `/${user.role}/dashboard`, label: 'Dashboard' },
      { to: '/funds', label: 'Mutual Funds' },
      { to: '/education', label: 'Education Center' },
    ];
  }, [user]);

  if (!user) return null;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <strong>MF</strong>
          <div>
            <div>MutualFunds Pro</div>
            <small>{roleLabel(user.role)} Workspace</small>
          </div>
        </div>

        <nav>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                styles.navLink + (isActive ? ' ' + styles.navActive : '')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h4>Real-time Mutual Fund Investment Platform</h4>

          <div className={styles.user}>
            <div className={styles.avatar}>{initials(user.name)}</div>
            <div>
              <div>{user.name}</div>
              <small>{roleLabel(user.role)}</small>
            </div>

            <button onClick={logout} className={styles.logout}>
              Logout
            </button>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}