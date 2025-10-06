import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App
