import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../assets/loading_nhac.json';
import { login } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (email && password) {
      try {
        setLoading(true);
        await login(email, password);
        navigate('/produtos');
      } catch (err: any) {
        setErrorMsg(err.message || 'Erro ao tentar fazer login.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-12 rounded-[32px] shadow-sm w-full max-w-[500px]">
        <div className="text-center mb-10">
          <img src="/logo.svg" alt="Nhac Logo" className="h-16 mx-auto mb-6" />
          <h1 className="text-[28px] font-bold text-marrom">Bem-vindo ao Nhac</h1>
          <p className="text-cinza text-[16px] mt-2">Faça login para fazer seu pedido</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center mb-6 text-sm font-medium">
            <AlertCircle size={20} className="mr-2" />
            {errorMsg}
          </div>
        )}

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
            disabled={loading}
            className="w-full bg-primary hover:opacity-90 disabled:opacity-50 text-[color:var(--color-texto-claro)] py-4 rounded-full text-[18px] font-semibold flex items-center justify-center transition-opacity mt-8 shadow-sm h-[60px]"
          >
            {loading ? (
               <div className="w-16 h-16">
                 <Player src={loadingAnimation} loop autoplay />
               </div>
            ) : (
              <>
                <LogIn size={24} className="mr-2" />
                Entrar
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[16px] text-cinza mt-8">
          Não tem uma conta? <a href="#" className="text-primary font-bold hover:underline">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
