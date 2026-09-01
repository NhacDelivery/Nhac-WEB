import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MdHome, MdShoppingCart, MdStorefront, MdPersonOutline, MdExitToApp } from 'react-icons/md';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import { logout } from './services/api';

function TopNavigation() {
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
    <header className="sticky top-0 z-40 border-b border-[#f3d7d4] bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Nhac Logo" className="h-10" />
        </Link>

        <div className="flex items-center gap-8 font-medium text-[#5d201c]">
          <NavLink to="/" end className={({ isActive }) => `transition-colors ${isActive ? 'text-[#ff6961]' : 'text-[#5d201c] hover:text-[#ff6961]'}`}>
            Início
          </NavLink>
          <NavLink to="/produtos" className={({ isActive }) => `transition-colors ${isActive ? 'text-[#ff6961]' : 'text-[#5d201c] hover:text-[#ff6961]'}`}>
            Cardápio
          </NavLink>

          {logged ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#5d201c]/80">Olá, <b>{nome}</b></span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-[#fff1f0] px-4 py-2 text-[#5d201c] transition hover:bg-red-100 hover:text-red-500"
              >
                <MdExitToApp size={18} /> Sair
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={({ isActive }) => `flex items-center gap-2 rounded-full px-5 py-2.5 transition ${isActive ? 'bg-[#ffefe9] text-[#ff6961]' : 'bg-[#f8f0ee] text-[#5d201c] hover:bg-[#f1e7e5]'}`}>
              <MdPersonOutline size={18} /> Entrar
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}

function FloatingNavigation() {
  const navItems = [
    { to: '/', label: 'Home', icon: MdHome },
    { to: '/produtos', label: 'Carrinho', icon: MdShoppingCart },
    { to: '/produtos', label: 'N sei', icon: MdStorefront },
    { to: '/login', label: 'Perfil', icon: MdPersonOutline },
  ];

  return (
    <aside className="fixed left-6 top-1/2 z-50 w-[88px] -translate-y-1/2 rounded-[28px] border border-[#f3d7d4] bg-white/90 p-3 shadow-[0_20px_40px_rgba(93,32,28,0.12)] backdrop-blur-sm">
      <nav className="flex flex-col items-center gap-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={`${to}-${label}`}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group relative flex w-full items-center justify-center overflow-hidden rounded-[24px] transition-all duration-300 ease-out ${
                isActive ? 'bg-[#ffefe9] text-[#ff6961] shadow-[0_6px_18px_rgba(255,105,97,0.18)]' : 'text-[#a0a0a0] hover:bg-[#fff8f6] hover:text-[#5d201c]'
              }`
            }
          >
            {({ isActive }) => (
              <div className="relative flex w-full items-center justify-center gap-2 px-2 py-3">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-[16px] transition-all duration-300 ease-out">
                  <Icon size={26} className={isActive ? 'text-[#ff6961]' : 'text-current'} />
                </div>
                <span
                  className={`relative z-10 overflow-hidden whitespace-nowrap text-[11px] font-semibold transition-all duration-300 ease-out ${
                    isActive ? 'max-w-[68px] opacity-100 text-[#ff6961]' : 'max-w-0 opacity-0'
                  }`}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-fundo text-marrom">
        <TopNavigation />
        <FloatingNavigation />
        <main className="mx-auto max-w-7xl px-6 pb-8 pt-6 pl-28">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/produtos" element={<Products />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
