import { useMemo, useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card/Card';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { SelectField, TextField } from '../../components/ui/Input/Input';
import { TableWrap } from '../../components/ui/Table/Table';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import shared from './dashboardShared.module.css';

function inr(n) {
  return `₹${Number(n).toLocaleString()}`;
}

function pct(n) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

export default function InvestorDashboardPage() {
  const { user } = useAuth();
  const { funds, getHoldings, buyFund } = useData();

  const holdings = user ? getHoldings(user.id) : [];

  const rows = useMemo(() => {
    return holdings.map((h) => {
      const fund = funds.find((f) => f.id === h.fundId);
      if (!fund) return null;

      const invested = h.units * h.avgNav;
      const current = h.units * fund.nav;
      const pnl = current - invested;
      const pnlPct = invested ? (pnl / invested) * 100 : 0;

      return { fund, h, invested, current, pnl, pnlPct };
    }).filter(Boolean);
  }, [holdings, funds]);

  const totals = useMemo(() => {
    const invested = rows.reduce((s, r) => s + r.invested, 0);
    const current = rows.reduce((s, r) => s + r.current, 0);
    const pnl = current - invested;
    const pnlPct = invested ? (pnl / invested) * 100 : 0;
    return { invested, current, pnl, pnlPct };
  }, [rows]);

  const [fundId, setFundId] = useState(funds[0]?.id || '');
  const [amount, setAmount] = useState('10000');
  const [error, setError] = useState(null);

  const onBuy = () => {
    if (!user) return;
    setError(null);

    const res = buyFund({
      userId: user.id,
      fundId,
      amount: Number(amount),
    });

    if (!res.ok) setError(res.error);
  };

  return (
    <div>
      <h2>Investor Dashboard</h2>

      <Card>
        <CardBody>
          <p>Current Value: {inr(totals.current)}</p>
          <p className={totals.pnl >= 0 ? shared.pos : shared.neg}>
            P/L: {inr(totals.pnl)} ({pct(totals.pnlPct)})
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Add Fund</CardHeader>
        <CardBody>
          <SelectField value={fundId} onChange={(e) => setFundId(e.target.value)}>
            {funds.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </SelectField>

          <TextField
            label="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <Button onClick={onBuy}>Invest</Button>

          {error && <p className={shared.neg}>{error}</p>}
        </CardBody>
      </Card>

      <TableWrap>
        <table>
          <thead>
            <tr>
              <th>Fund</th>
              <th>Units</th>
              <th>Invested</th>
              <th>Current</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((r, i) => (
              <tr key={i}>
                <td>{r.fund.name}</td>
                <td>{r.h.units.toFixed(2)}</td>
                <td>{inr(r.invested)}</td>
                <td>{inr(r.current)}</td>
                <td>
                  <Badge variant={r.pnl >= 0 ? 'success' : 'danger'}>
                    {inr(r.pnl)} ({pct(r.pnlPct)})
                  </Badge>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5">No investments yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrap>
    </div>
  );
}