import { LS_KEYS } from './keys';
import { readJSON, writeJSON } from './json';

const demoUsers = [
  {
    id: 'u_admin',
    name: 'Platform Admin',
    email: 'admin@mf.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 'u_investor',
    name: 'Demo Investor',
    email: 'investor@mf.com',
    password: 'investor123',
    role: 'investor',
    createdAt: new Date('2025-02-10').toISOString(),
  },
  {
    id: 'u_advisor',
    name: 'Demo Advisor',
    email: 'advisor@mf.com',
    password: 'advisor123',
    role: 'advisor',
    createdAt: new Date('2025-03-05').toISOString(),
  },
  {
    id: 'u_analyst',
    name: 'Demo Analyst',
    email: 'analyst@mf.com',
    password: 'analyst123',
    role: 'analyst',
    createdAt: new Date('2025-04-18').toISOString(),
  },
];

const demoFunds = [
  {
    id: 'f_sbi_bluechip',
    name: 'SBI Bluechip Fund (Direct)',
    category: 'Equity',
    risk: 'High',
    nav: 58.45,
    aumCr: 25000,
    expenseRatioPct: 1.02,
    returns: { '1Y': 12.5, '3Y': 14.2, '5Y': 13.8 },
    description: 'Large-cap focused strategy designed for long-term compounding with controlled drawdowns.',
    manager: 'Rajeev Radhakrishnan',
    launchDate: '2006-01-01',
    minInvestment: 500,
  },
  {
    id: 'f_hdfc_corp_bond',
    name: 'HDFC Corporate Bond Fund (Direct)',
    category: 'Debt',
    risk: 'Low',
    nav: 25.67,
    aumCr: 15000,
    expenseRatioPct: 0.42,
    returns: { '1Y': 6.5, '3Y': 7.1, '5Y': 7.5 },
    description: 'High-quality corporate bond exposure designed for stability, income, and lower volatility.',
    manager: 'Anupama Gupta',
    launchDate: '2010-05-15',
    minInvestment: 100,
  },
  {
    id: 'f_icici_balanced',
    name: 'ICICI Prudential Balanced Advantage (Direct)',
    category: 'Hybrid',
    risk: 'Medium',
    nav: 45.23,
    aumCr: 30000,
    expenseRatioPct: 0.88,
    returns: { '1Y': 10.8, '3Y': 11.5, '5Y': 12.0 },
    description: 'Dynamic asset allocation strategy that adapts between equity and debt based on valuations.',
    manager: 'Sankaran Naren',
    launchDate: '2008-12-10',
    minInvestment: 100,
  },
  {
    id: 'f_nifty_50_index',
    name: 'Nifty 50 Index Fund (Direct)',
    category: 'Index',
    risk: 'High',
    nav: 18.9,
    aumCr: 10000,
    expenseRatioPct: 0.22,
    returns: { '1Y': 11.2, '3Y': 12.8, '5Y': 13.2 },
    description: 'Low-cost passive exposure to India’s top 50 companies with transparent index tracking.',
    manager: 'Index Management',
    launchDate: '2015-03-20',
    minInvestment: 100,
  },
  {
    id: 'f_axis_midcap',
    name: 'Axis Midcap Opportunities (Direct)',
    category: 'Equity',
    risk: 'High',
    nav: 37.65,
    aumCr: 8200,
    expenseRatioPct: 0.95,
    returns: { '1Y': 16.4, '3Y': 17.6, '5Y': 15.9 },
    description: 'Mid-cap oriented portfolio aiming to capture growth with disciplined risk controls.',
    manager: 'Jinesh Gopani',
    launchDate: '2013-07-11',
    minInvestment: 500,
  },
  {
    id: 'f_kotak_liquid',
    name: 'Kotak Liquid Fund (Direct)',
    category: 'Debt',
    risk: 'Low',
    nav: 32.11,
    aumCr: 29000,
    expenseRatioPct: 0.18,
    returns: { '1Y': 5.2, '3Y': 5.6, '5Y': 5.8 },
    description: 'Cash management solution with short-duration instruments for liquidity and stability.',
    manager: 'Himanshu Nanda',
    launchDate: '2007-10-03',
    minInvestment: 100,
  },
];

export function ensureSeeded() {
  const users = readJSON(LS_KEYS.users, []);
  if (users.length === 0) writeJSON(LS_KEYS.users, demoUsers);

  const funds = readJSON(LS_KEYS.funds, []);
  if (funds.length === 0) writeJSON(LS_KEYS.funds, demoFunds);

  const holdings = readJSON(LS_KEYS.holdings, []);
  if (holdings.length === 0) writeJSON(LS_KEYS.holdings, []);

  const activity = readJSON(LS_KEYS.activity, []);
  if (activity.length === 0) writeJSON(LS_KEYS.activity, []);
}