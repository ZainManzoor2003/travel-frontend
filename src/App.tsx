import AppRouter from './router';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App
