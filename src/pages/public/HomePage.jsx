import { ButtonLink } from '../../components/ui/Button/Button.jsx';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <h1 className={styles.heroTitle}>Smart Mutual Fund Investment Platform</h1>

          <p className={styles.subtitle}>
            Analyze, Invest, and Grow with Confidence. Banking-grade experience
            with role-based dashboards, analytics, and professional fund comparison.
          </p>

          <div className={styles.actions}>
            <ButtonLink to="/login">Login</ButtonLink>
            <ButtonLink to="/signup" variant="secondary">Signup</ButtonLink>
            <ButtonLink to="/funds" variant="ghost">Browse Funds</ButtonLink>
          </div>
        </div>

        {/* MARKET SNAPSHOT */}
        <div className={styles.snapshot}>
          <h3>Live Market Snapshot (Demo)</h3>
          <div className={styles.snapshotGrid}>
            <div className={styles.snapshotCard}>
              <strong>Active funds tracked</strong>
              <span>6</span>
            </div>

            <div className={styles.snapshotCard}>
              <strong>Realtime NAV updates</strong>
              <span>Every ~3s</span>
            </div>

            <div className={styles.snapshotCard}>
              <strong>Risk signals</strong>
              <span>Low / Med / High</span>
            </div>

            <div className={styles.snapshotCard}>
              <strong>Analytics</strong>
              <span>Charts & dashboards</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.section}>
        <h2>Core Platform Features</h2>
        <div className={styles.grid}>
          <div className={styles.featureCard}>
            <h4>Role-based dashboards</h4>
            <p>Admin, Investor, Advisor, and Analyst views with protected routes.</p>
          </div>

          <div className={styles.featureCard}>
            <h4>Real-time analytics</h4>
            <p>Live NAV simulation drives charts and performance indicators.</p>
          </div>

          <div className={styles.featureCard}>
            <h4>Secure demo authentication</h4>
            <p>LocalStorage-backed demo login with realistic session behavior.</p>
          </div>

          <div className={styles.featureCard}>
            <h4>Professional comparison</h4>
            <p>Search, filter, view details, and compare with consistent UX.</p>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className={styles.section}>
        <h2>User Roles</h2>
        <div className={styles.grid}>
          <div className={styles.roleCard}>
            <h4>Admin</h4>
            <p>Platform overview, user management, fund distribution analytics.</p>
          </div>

          <div className={styles.roleCard}>
            <h4>Investor</h4>
            <p>Portfolio tracking, allocation, growth analytics, invest & compare.</p>
          </div>

          <div className={styles.roleCard}>
            <h4>Financial Advisor</h4>
            <p>Investor insights, recommendations, risk-return review and notes.</p>
          </div>

          <div className={styles.roleCard}>
            <h4>Data Analyst</h4>
            <p>Performance metrics, category trends, AUM growth and reporting UI.</p>
          </div>
        </div>
      </section>

    </div>
  );
}