import { NavLink, Outlet } from 'react-router-dom';
import styles from './PublicLayout.module.css';
import { Button, ButtonLink } from '../components/ui/Button/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function PublicLayout() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <strong>MF</strong>
          <span>MutualFunds Pro</span>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              styles.link + (isActive ? ' ' + styles.active : '')
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              styles.link + (isActive ? ' ' + styles.active : '')
            }
          >
            About
          </NavLink>
          <NavLink
            to="/funds"
            className={({ isActive }) =>
              styles.link + (isActive ? ' ' + styles.active : '')
            }
          >
            Mutual Funds
          </NavLink>
          <NavLink
            to="/education"
            className={({ isActive }) =>
              styles.link + (isActive ? ' ' + styles.active : '')
            }
          >
            Education Center
          </NavLink>
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <ButtonLink to={`/${user.role}/dashboard`} variant="secondary">
                Dashboard
              </ButtonLink>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <ButtonLink to="/login" variant="secondary">
                Login
              </ButtonLink>
              <ButtonLink to="/signup">
                Signup
              </ButtonLink>
            </>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}