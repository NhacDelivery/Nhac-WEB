import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import { User } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-fundo text-marrom">
        {/* Desktop Top Navigation */}
        <nav className="bg-white px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
          <Link to="/">
            <img src="/logo.svg" alt="Nhac Logo" className="h-10" />
          </Link>
          <div className="flex items-center gap-8 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <Link to="/produtos" className="hover:text-primary transition-colors">Cardápio</Link>
            <Link to="/login" className="flex items-center gap-2 bg-secondary text-marrom px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              <User size={20} /> Entrar
            </Link>
          </div>
        </nav>

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

export default App;
