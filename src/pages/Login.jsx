import { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if(email && password) navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-12 rounded-[32px] shadow-sm w-full max-w-[500px]">
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="Nhac Logo" className="h-16 mx-auto mb-6" />
          <h1 className="text-[28px] font-bold text-marrom">Bem-vindo ao Nhac</h1>
          <p className="text-cinza text-[16px] mt-2">Faça login para fazer seu pedido</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[16px] font-medium text-marrom mb-2">E-mail</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-fundo/50 border border-secondary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-marrom"
                placeholder="seu@email.com"
              />
              <Mail className="absolute left-4 top-4 text-cinza" size={24} />
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-medium text-marrom mb-2">Senha</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-fundo/50 border border-secondary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-marrom"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-4 text-cinza" size={24} />
            </div>
            <div className="text-right mt-3">
              <a href="#" className="text-[14px] text-primary font-medium hover:underline">Esqueceu a senha?</a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-[#e5564f] text-white py-4 rounded-full text-[18px] font-semibold flex items-center justify-center transition-colors mt-8 shadow-sm"
          >
            <LogIn size={24} className="mr-2" />
            Entrar
          </button>
        </form>

        <p className="text-center text-[16px] text-cinza mt-8">
          Não tem uma conta? <a href="#" className="text-primary font-bold hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
