import { useMemo, useState } from 'react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card/Card';
import { Badge } from '../../components/ui/Badge/Badge';
import { Button } from '../../components/ui/Button/Button';
import { TableWrap } from '../../components/ui/Table/Table';
import { useData } from '../../contexts/DataContext';
import { LS_KEYS } from '../../storage/keys';
import { readJSON } from '../../storage/json';
import shared from './dashboardShared.module.css';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/* ---------------- helpers ---------------- */

function formatInt(n) {
  return Number(n).toLocaleString();
}

function monthLabel(d) {
  return d.toLocaleDateString(undefined, { month: 'short' });
}

function buildUserGrowth(users) {
  const now = new Date();
  const months = 8;
  const buckets = [];

  for (let i = months - 1; i >= 0; i--) {
    const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = dt.getTime();
    const end = new Date(dt.getFullYear(), dt.getMonth() + 1, 1).getTime();

    const total = users.filter((u) => {
      const t = new Date(u.createdAt).getTime();
      return t >= start && t < end;
    }).length;

    buckets.push({ m: monthLabel(dt), total });
  }

  let running = 0;
  return buckets.map((b) => {
    running += b.total;
    return { m: b.m, users: running };
  });
}

function catPie(funds) {
  const map = new Map();
  funds.forEach((f) => {
    map.set(f.category, (map.get(f.category) || 0) + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

const pieColors = ['#2F80ED', '#19A974', '#D64545', '#263445'];

/* ---------------- component ---------------- */

export default function AdminDashboardPage() {
  const { funds, addFund } = useData();

  const users = readJSON(LS_KEYS.users, []);
  const activity = readJSON(LS_KEYS.activity, []);

  const metrics = useMemo(() => {
    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    const events24h = activity.filter(
      (e) => new Date(e.at).getTime() >= last24h
    ).length;

    return {
      totalUsers: users.length,
      activeFunds: funds.length,
      activity24h: events24h,
    };
  }, [users, funds, activity]);

  const userGrowth = useMemo(() => buildUserGrowth(users), [users]);
  const catData = useMemo(() => catPie(funds), [funds]);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Equity');
  const [newRisk, setNewRisk] = useState('Medium');

  const createFund = () => {
    if (!newName.trim()) return;

    addFund({
      name: newName.trim(),
      category: newCategory,
      risk: newRisk,
      nav: 20 + Math.random() * 40,
      aumCr: Math.round(3000 + Math.random() * 24000),
      expenseRatioPct: 0.5,
      returns: { '1Y': 8, '3Y': 12, '5Y': 15 },
      manager: 'Internal Team',
      launchDate: new Date().toISOString().slice(0, 10),
      minInvestment: 500,
      description: 'Admin-added demo fund',
    });

    setNewName('');
    setShowAdd(false);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Platform overview (demo data stored locally)</p>

      {/* METRICS */}
      <div className={shared.grid3}>
        <Card>
          <CardBody>
            <h4>Total Users</h4>
            <p>{formatInt(metrics.totalUsers)}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h4>Active Funds</h4>
            <p>{formatInt(metrics.activeFunds)}</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h4>Activity (24h)</h4>
            <p>{formatInt(metrics.activity24h)}</p>
          </CardBody>
        </Card>
      </div>

      {/* CHARTS */}
      <div className={shared.grid2}>
        <Card>
          <CardHeader title="User Growth" />
          <CardBody style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="m" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#2F80ED" />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Funds by Category" />
          <CardBody style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" label>
                  {catData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* USERS TABLE */}
      <Card>
        <CardHeader title="Recent Users" />
        <CardBody>
          <TableWrap>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((u, i) => (
                  <tr key={i}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </CardBody>
      </Card>

      {/* FUND MANAGEMENT */}
      <Card>
        <CardHeader
          title="Fund Management"
          right={
            <Button onClick={() => setShowAdd((v) => !v)}>
              {showAdd ? 'Close' : 'Add Fund'}
            </Button>
          }
        />
        <CardBody>
          {showAdd && (
            <>
              <input
                placeholder="Fund name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />

              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                <option>Equity</option>
                <option>Debt</option>
                <option>Hybrid</option>
                <option>Index</option>
              </select>

              <select value={newRisk} onChange={(e) => setNewRisk(e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <Button onClick={createFund}>Create</Button>
            </>
          )}

          <TableWrap>
            <table>
              <thead>
                <tr>
                  <th>Fund</th>
                  <th>Category</th>
                  <th>Risk</th>
                  <th>NAV</th>
                  <th>AUM (Cr)</th>
                </tr>
              </thead>
              <tbody>
                {funds.slice(0, 10).map((f) => (
                  <tr key={f.id}>
                    <td>{f.name}</td>
                    <td>{f.category}</td>
                    <td>
                      <Badge>{f.risk}</Badge>
                    </td>
                    <td>₹{f.nav.toFixed(2)}</td>
                    <td>{formatInt(f.aumCr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
        </CardBody>
      </Card>
    </div>
  );
}