import { useData } from '../../contexts/DataContext';

export default function AnalystDashboardPage() {
  const { funds } = useData();

  return (
    <div>
      <h1>Data Analyst Dashboard</h1>
      <p>Total funds tracked: {funds.length}</p>
      {/* Additional analytics UI can be added here */}
    </div>
  );
}
