import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      
      {/* HERO */}
      <section className={styles.hero}>
        <h1>About Mutual Funds</h1>
        <p>
          Mutual funds pool money from multiple investors to invest in a diversified basket of securities.
          Managed professionally, they balance risk and return to achieve your investment goals.
        </p>
      </section>

      {/* BASICS */}
      <section className={styles.section}>
        <div className={styles.card}>
          <h3>What are Mutual Funds?</h3>
          <p>
            A mutual fund is an investment vehicle that invests in equities, bonds, or a combination of assets.
            Investors gain diversification, professional management, and access to a wider market.
          </p>
        </div>

        <div className={styles.card}>
          <h3>NAV Explained (Net Asset Value)</h3>
          <p>
            NAV is the per-unit price of a mutual fund, calculated as 
            (Total Assets − Total Liabilities) / Units Outstanding.
            It changes based on market movements and portfolio valuation.
          </p>
        </div>
      </section>

      {/* TYPES */}
      <section className={styles.section}>
        <h2>Types of Mutual Funds</h2>
        <div className={styles.typesGrid}>
          <div className={styles.typeCard}>
            <h4>Equity</h4>
            <p>High growth potential, higher volatility and market risk.</p>
          </div>
          <div className={styles.typeCard}>
            <h4>Debt</h4>
            <p>Stable returns using bonds and money market instruments.</p>
          </div>
          <div className={styles.typeCard}>
            <h4>Hybrid</h4>
            <p>Blends equity and debt to balance risk and return dynamically.</p>
          </div>
          <div className={styles.typeCard}>
            <h4>Index</h4>
            <p>Tracks a market index with low cost and transparent exposure.</p>
          </div>
        </div>
      </section>

      {/* RISK VS RETURN */}
      <section className={styles.section}>
        <h2>Risk vs Return</h2>
        <div className={styles.riskGrid}>
          <div className={`${styles.riskCard} ${styles.low}`}>
            <h4>Low Risk (Stable)</h4>
            <p>Debt or liquid funds. Lower drawdowns and steady outcomes, ideal for short-term goals.</p>
          </div>

          <div className={`${styles.riskCard} ${styles.med}`}>
            <h4>Medium Risk (Balanced)</h4>
            <p>Hybrid strategies with controlled volatility for medium-term horizons and risk-aware investors.</p>
          </div>

          <div className={`${styles.riskCard} ${styles.high}`}>
            <h4>High Risk (Growth)</h4>
            <p>Equity and aggressive funds. Higher potential returns with sharper short-term fluctuations.</p>
          </div>
        </div>
      </section>
    </div>
  );
}