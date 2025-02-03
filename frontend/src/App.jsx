import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </div>
  );
}
