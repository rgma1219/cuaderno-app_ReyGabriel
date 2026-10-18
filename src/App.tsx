import { AuthProvider } from './features/auth/AuthContext';
import { AppRouter } from './routes/AppRouter';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
