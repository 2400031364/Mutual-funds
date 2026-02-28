import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import RequireAuth from './routes/RequireAuth.jsx';
import RoleRedirect from './routes/RoleRedirect.jsx';

import HomePage from './pages/public/HomePage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import FundsListPage from './pages/public/FundsListPage.jsx';
import FundDetailsPage from './pages/public/FundDetailsPage.jsx';
import EducationPage from './pages/public/EducationPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';

import AdminDashboardPage from './pages/dashboards/AdminDashboardPage.jsx';
import InvestorDashboardPage from './pages/dashboards/InvestorDashboardPage.jsx';
import AdvisorDashboardPage from './pages/dashboards/AdvisorDashboardPage.jsx';
import AnalystDashboardPage from './pages/dashboards/AnalystDashboardPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/funds" element={<FundsListPage />} />
        <Route path="/funds/:fundId" element={<FundDetailsPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route path="/dashboard" element={<RoleRedirect />} />

      <Route element={<DashboardLayout />}>
        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['investor']} />}>
          <Route path="/investor/dashboard" element={<InvestorDashboardPage />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['advisor']} />}>
          <Route path="/advisor/dashboard" element={<AdvisorDashboardPage />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={['analyst']} />}>
          <Route path="/analyst/dashboard" element={<AnalystDashboardPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}


