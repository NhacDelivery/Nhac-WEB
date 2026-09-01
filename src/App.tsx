import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  MdOutlineHome,
  MdOutlineShoppingBag,
  MdPersonOutline,
  MdExitToApp,
  MdArrowUpward,
} from 'react-icons/md';
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

function FloatingBottomNavigation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home', icon: MdOutlineHome },
    { to: '/produtos', label: 'Cardápio', icon: MdOutlineShoppingBag },
    { to: '/login', label: 'Perfil', icon: MdPersonOutline },
  ];

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCollapsed = scrollY > 150;

  return (
    <>
      <div className="fixed left-5 top-1/2 z-40 -translate-y-1/2">
        <div className="rounded-[32px] border border-[#f3d7d4] bg-white/90 p-2 shadow-[0_18px_38px_rgba(93,32,28,0.12)] backdrop-blur-sm">
          <nav className="flex flex-col items-start gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={`${to}-${label}`}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `group relative flex h-[60px] items-center overflow-hidden rounded-[24px] transition-all duration-400 ease-out ${
                    isActive
                      ? 'w-[150px] bg-[#ffefe9] px-4 text-[#ff6961] shadow-[0_8px_20px_rgba(255,105,97,0.18)]'
                      : 'w-[56px] px-2 text-[#a0a0a0] hover:text-[#5d201c]'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="relative flex items-center transition-all duration-400 ease-out">
                    <Icon size={27} className={isActive ? 'text-[#ff6961]' : 'text-current'} />

                    <span
                      className={`inline-block overflow-hidden whitespace-nowrap text-[15px] font-semibold transition-all duration-400 ease-out ${
                        isActive
                          ? 'ml-3 max-w-[90px] opacity-100 text-[#ff6961]'
                          : 'ml-0 max-w-[0px] opacity-0 text-transparent'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <button
        onClick={handleScrollTop}
        className={`fixed bottom-[118px] right-6 z-50 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#ff6961] text-white shadow-[0_10px_24px_rgba(255,105,97,0.32)] transition-all duration-300 ease-out ${
          isCollapsed ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <MdArrowUpward size={24} />
      </button>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-fundo text-marrom">
        <TopNavigation />
        <FloatingBottomNavigation />
        <main className="mx-auto max-w-7xl px-6 pb-28 pt-6">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/produtos" element={<Products />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
