import { useMemo, useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card/Card';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { TableWrap } from '../../components/ui/Table/Table';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LS_KEYS } from '../../storage/keys';
import { readJSON, writeJSON } from '../../storage/json';
import shared from './dashboardShared.module.css';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

/* ---------- helpers ---------- */

function inr(n) {
  return `₹${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function riskScore(risk) {
  return risk === 'Low' ? 1 : risk === 'Medium' ? 2 : 3;
}

function marketSeries() {
  const points = 18;
  const out = [];
  let v = 100;

  for (let i = points - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    const label = d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
    v = v * (1 + (Math.random() - 0.44) * 0.025);
    out.push({ m: label, index: Math.round(v * 10) / 10 });
  }
  return out;
}

/* ---------- component ---------- */

export default function AdvisorDashboardPage() {
  const { user } = useAuth();
  const { funds } = useData();

  const users = readJSON(LS_KEYS.users, []);
  const holdings = readJSON(LS_KEYS.holdings, []);

  const investors = useMemo(
    () => users.filter((u) => u.role === 'investor'),
    [users]
  );

  const investorRows = useMemo(() => {
    return investors.map((inv) => {
      const invHoldings = holdings.filter((h) => h.userId === inv.id);
      const current = invHoldings.reduce((sum, h) => {
        const fund = funds.find((f) => f.id === h.fundId);
        return sum + (fund ? fund.nav * h.units : 0);
      }, 0);
      return { inv, holdings: invHoldings.length, current };
    });
  }, [investors, holdings, funds]);

  const recommended = useMemo(() => {
    return [...funds]
      .sort((a, b) => b.returns['1Y'] - a.returns['1Y'])
      .slice(0, 4);
  }, [funds]);

  const scatterData = useMemo(() => {
    return funds.map((f) => ({
      name: f.name,
      risk: riskScore(f.risk),
      r1y: f.returns['1Y'],
      aum: f.aumCr,
    }));
  }, [funds]);

  const [notes, setNotes] = useState(() => {
    if (!user) return '';
    const map = readJSON(LS_KEYS.advisorNotes, {});
    return map[user.id] || '';
  });

  const saveNotes = () => {
    if (!user) return;
    const map = readJSON(LS_KEYS.advisorNotes, {});
    writeJSON(LS_KEYS.advisorNotes, { ...map, [user.id]: notes });
  };

  const market = useMemo(() => marketSeries(), []);

  return (
    <div>
      <h2>Financial Advisor Dashboard</h2>
      <p>Investor overview, recommendations, and risk-return insights.</p>

      {/* RISK vs RETURN */}
      <Card>
        <CardHeader title="Risk vs Return (1Y)" />
        <CardBody style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid />
              <XAxis
                type="number"
                dataKey="risk"
                domain={[0.5, 3.5]}
                ticks={[1, 2, 3]}
                tickFormatter={(v) =>
                  v === 1 ? 'Low' : v === 2 ? 'Medium' : 'High'
                }
              />
              <YAxis
                type="number"
                dataKey="r1y"
                tickFormatter={(v) => `${v}%`}
              />
              <ZAxis type="number" dataKey="aum" range={[60, 400]} />
              <Tooltip />
              <Scatter data={scatterData} fill="#2F80ED" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* MARKET TREND */}
      <Card>
        <CardHeader title="Market Trend" />
        <CardBody style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={market}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Line dataKey="index" stroke="#19A974" />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* INVESTORS */}
      <Card>
        <CardHeader title="Investor Overview" />
        <CardBody>
          <TableWrap>
            <table>
              <thead>
                <tr>
                  <th>Investor</th>
                  <th>Email</th>
                  <th>Holdings</th>
                  <th>Current Value</th>
                </tr>
              </thead>
              <tbody>
                {investorRows.length ? (
                  investorRows.map((r) => (
                    <tr key={r.inv.id}>
                      <td>{r.inv.name}</td>
                      <td>{r.inv.email}</td>
                      <td>{r.holdings}</td>
                      <td>{inr(r.current)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No investor accounts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableWrap>
        </CardBody>
      </Card>

      {/* RECOMMENDATIONS */}
      <Card>
        <CardHeader title="Top Recommendations" />
        <CardBody>
          {recommended.map((f) => (
            <div key={f.id} className="surface" style={{ padding: 12, marginBottom: 10 }}>
              <strong>{f.name}</strong>
              <p>{f.category} • {f.manager}</p>
              <Badge>{f.risk}</Badge> • 1Y: {f.returns['1Y']}%
            </div>
          ))}
        </CardBody>
      </Card>

      {/* NOTES */}
      <Card>
        <CardHeader
          title="Advisory Notes"
          right={<Button onClick={saveNotes}>Save Notes</Button>}
        />
        <CardBody>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write advisory notes..."
            style={{
              width: '100%',
              minHeight: 140,
              padding: 12,
              borderRadius: 12,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}