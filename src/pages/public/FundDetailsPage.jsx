import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Badge } from '../../components/ui/Badge/Badge';
import styles from './FundDetailsPage.module.css';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function riskTone(risk) {
  if (risk === 'Low') return 'success';
  if (risk === 'Medium') return 'warning';
  return 'danger';
}

function formatINR(n) {
  return `₹${n.toFixed(2)}`;
}

function formatPct(n) {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

function buildSeries(navNow) {
  const points = 28;
  const series = [];
  let nav = navNow * 0.93;

  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const label = d.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
    });

    const pct = (Math.random() - 0.45) * 0.35;
    nav = Math.max(1, nav * (1 + pct / 100));

    series.push({
      day: label,
      nav: Math.round(nav * 100) / 100,
    });
  }

  series[series.length - 1] = {
    ...series[series.length - 1],
    nav: Math.round(navNow * 100) / 100,
  };

  return series;
}

export default function FundDetailsPage() {
  const { fundId } = useParams();
  const { funds } = useData();

  const fund = funds.find((f) => f.id === fundId);

  const series = useMemo(() => {
    if (!fund) return [];
    return buildSeries(fund.nav);
  }, [fund]);

  if (!fundId) return <Navigate to="/funds" replace />;
  if (!fund) return <Navigate to="/funds" replace />;

  return (
    <div className={styles.page}>
      <Link to="/funds" className={styles.back}>
        ← Back to Mutual Funds
      </Link>

      <header className={styles.header}>
        <div>
          <h1>{fund.name}</h1>
          <p>{fund.description}</p>
        </div>

        <div className={styles.badges}>
          <Badge tone={riskTone(fund.risk)}>{fund.risk} Risk</Badge>
          <Badge>{fund.category}</Badge>
        </div>
      </header>

      <section className={styles.chart}>
        <h3>NAV Trend (Last 28 Days • Demo)</h3>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={series}>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${Number(v).toFixed(0)}`}
              width={46}
            />
            <Tooltip
              formatter={(value) => formatINR(Number(value))}
              contentStyle={{ borderRadius: 12 }}
            />
            <Line
              type="monotone"
              dataKey="nav"
              stroke="#2F80ED"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <section className={styles.stats}>
        <div>
          <span>Current NAV</span>
          <strong>{formatINR(fund.nav)}</strong>
        </div>

        <div>
          <span>Assets Under Management</span>
          <strong>{fund.aumCr.toLocaleString()} Cr</strong>
        </div>

        <div>
          <span>Expense Ratio</span>
          <strong>{fund.expenseRatioPct.toFixed(2)}%</strong>
        </div>

        <div>
          <span>Minimum Investment</span>
          <strong>₹{fund.minInvestment.toLocaleString()}</strong>
        </div>

        <div>
          <span>1Y Return</span>
          <strong>{formatPct(fund.returns['1Y'])}</strong>
        </div>

        <div>
          <span>3Y Return</span>
          <strong>{formatPct(fund.returns['3Y'])}</strong>
        </div>

        <div>
          <span>5Y Return</span>
          <strong>{formatPct(fund.returns['5Y'])}</strong>
        </div>

        <div>
          <span>Fund Manager</span>
          <strong>{fund.manager}</strong>
        </div>

        <div>
          <span>Launch Date</span>
          <strong>{new Date(fund.launchDate).toLocaleDateString()}</strong>
        </div>
      </section>
    </div>
  );
}