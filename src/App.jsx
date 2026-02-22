import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { token } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200">
      {token ? <DashboardPage /> : <AuthPage />}
    </main>
  );
}

export default App;
