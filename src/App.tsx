import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import { User, LogOut } from 'lucide-react';
import { logout } from './services/api';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logged, setLogged] = useState<boolean>(false);
  const [nome, setNome] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const nomeStorage = localStorage.getItem('nome');
    if (token) {
      setLogged(true);
      setNome(nomeStorage || 'Usuário');
    } else {
      setLogged(false);
      setNome('');
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    setLogged(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/">
        <img src="/logo.svg" alt="Nhac Logo" className="h-10" />
      </Link>
      <div className="flex items-center gap-8 font-medium">
        <Link to="/" className="hover:text-primary transition-colors">Início</Link>
        <Link to="/produtos" className="hover:text-primary transition-colors">Cardápio</Link>
        
        {logged ? (
          <div className="flex items-center gap-4">
            <span className="text-marrom/80">Olá, <b>{nome}</b></span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-fundo text-marrom px-4 py-2 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} /> Sair
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 bg-secondary text-marrom px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-colors">
            <User size={20} /> Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-fundo text-marrom">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/produtos" element={<Products />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
