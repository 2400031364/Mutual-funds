import { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Badge } from '../../components/ui/Badge/Badge';
import { ButtonLink } from '../../components/ui/Button/Button'; // make sure this exists
import { TableWrap, tableStyles } from '../../components/ui/Table/Table';
import styles from './FundsListPage.module.css';

function riskTone(risk) {
  if (risk === 'Low') return 'success';
  if (risk === 'Medium') return 'warning';
  return 'danger';
}

function formatPct(n) {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

function formatINR(n) {
  return `₹${n.toFixed(2)}`;
}

export default function FundsListPage() {
  const { funds } = useData();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return funds
      .filter((f) => (cat === 'All' ? true : f.category === cat))
      .filter((f) => (query ? f.name.toLowerCase().includes(query) : true));
  }, [funds, q, cat]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Mutual Funds</h1>
        <p>
          Search and compare professional fund profiles with live NAV simulation.
          Use filters to narrow down by category and evaluate risk-return patterns.
        </p>

        <div className={styles.filters}>
          <input
            className={styles.input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by fund name..."
          />

          <select
            className={`${styles.input} ${styles.select}`}
            value={cat}
            onChange={(e) => setCat(e.target.value)}
          >
            <option value="All">All categories</option>
            <option value="Equity">Equity</option>
            <option value="Debt">Debt</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Index">Index</option>
          </select>
        </div>
      </header>

      <div className={styles.meta}>
        <span>
          Showing {filtered.length} of {funds.length} funds
        </span>
        <span className={styles.live}>Live NAV updates (demo)</span>
      </div>

      <TableWrap>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Fund Name</th>
              <th>Category</th>
              <th>NAV</th>
              <th>1Y</th>
              <th>3Y</th>
              <th>5Y</th>
              <th>Risk Level</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((f) => (
              <tr key={f.id}>
                <td>
                  <strong className={styles.fundName}>{f.name}</strong>
                  <div className={styles.sub}>
                    Min investment: ₹{f.minInvestment.toLocaleString()}
                  </div>
                </td>

                <td>{f.category}</td>
                <td>{formatINR(f.nav)}</td>
                <td>{formatPct(f.returns['1Y'])}</td>
                <td>{formatPct(f.returns['3Y'])}</td>
                <td>{formatPct(f.returns['5Y'])}</td>

                <td>
                  <Badge tone={riskTone(f.risk)}>{f.risk}</Badge>
                </td>

                <td>
                  <ButtonLink to={`/funds/${f.id}`}>
                    View Details
                  </ButtonLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </div>
  );
}