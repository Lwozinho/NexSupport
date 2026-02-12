import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Importe o Provedor

import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      {/* O AuthProvider fica DENTRO do Router ou fora, mas deve envolver as Rotas */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<div className="p-4">Página não encontrada</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}