import styles from './EducationPage.module.css';

function Icon({ path, color }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "#3b82f6"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export default function EducationPage() {
  const guides = [
    {
      title: "SIP vs Lump Sum",
      text: "SIP invests regularly using rupee-cost averaging, while lump sum invests at once. SIP reduces timing risk, while lump sum can benefit when valuations are attractive.",
      icon: "M3 12h18M12 3v18",
      color: "#10b981",
    },
    {
      title: "Expense Ratio",
      text: "Annual fee charged by the fund as a percentage of assets. Lower expense ratios can significantly improve long-term compounding, especially for index funds.",
      icon: "M12 2v20M2 12h20",
      color: "#f59e0b",
    },
    {
      title: "Market Risk",
      text: "Returns fluctuate due to market cycles. Risk is higher in equity and lower in high-quality debt, but never zero. Diversification and time horizon help manage risk.",
      icon: "M3 17l6-6 4 4 8-8",
      color: "#ef4444",
    },
    {
      title: "Long-term Benefits",
      text: "Investing for longer horizons improves the odds of achieving target returns and absorbing volatility. Compounding works best when you stay invested and rebalance when needed.",
      icon: "M12 20V10M18 20V4M6 20v-6",
      color: "#6366f1",
    },
  ];

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1>Education Center</h1>
        <p>
          Clear fundamentals for confident investing. Short guides mirror explanations
          you would find in a wealth management portal — concise, structured, and practical.
        </p>
      </section>

      {/* Cards */}
      <section className={styles.grid}>
        {guides.map((g, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.icon}>
              <Icon path={g.icon} color={g.color} />
            </div>
            <div>
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}