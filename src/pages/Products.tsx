import React, { useState, useEffect } from 'react';
import { Star, Clock, Heart, AlertCircle, X, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../assets/loading_nhac.json';
import { fetchProdutos, Produto } from '../services/api';

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = ['Todos', 'Lanches', 'Pizzas', 'Saudável', 'Doces'];

  useEffect(() => {
    loadProducts();
  }, [activeCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProdutos(activeCategory);
      setProducts(data);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') {
        setError('UNAUTHORIZED');
      } else {
        setError("Não foi possível conectar ao servidor. O backend pode estar em repouso (Render).");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 relative">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold text-marrom mb-6">Nosso Cardápio</h1>
        
        {/* Category Filters */}
        <div className="flex gap-4 border-b border-secondary pb-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              disabled={loading}
              className={`px-8 py-3 rounded-full text-[16px] font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white text-marrom hover:bg-secondary/50 border border-secondary'
              } disabled:opacity-50`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-64 h-64">
            <Player src={loadingAnimation} loop autoplay />
          </div>
          <p className="text-primary font-bold text-lg mt-4 animate-pulse">Preparando as delícias...</p>
        </div>
      ) : error === 'UNAUTHORIZED' ? (
        <div className="bg-white p-12 rounded-[32px] shadow-sm text-center max-w-lg mx-auto my-12 border border-primary/20">
           <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
             <Lock size={40} />
           </div>
           <h3 className="text-2xl font-bold text-marrom mb-4">Acesso Restrito</h3>
           <p className="text-cinza mb-8 text-[16px]">Você precisa fazer login para visualizar o nosso cardápio de delícias.</p>
           <button 
             onClick={() => navigate('/login')}
             className="bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-[#e5564f] transition-colors inline-flex items-center"
           >
             <LogIn className="mr-2" size={24} /> Fazer Login
           </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/30 flex flex-col group">
              <div className="relative h-56 w-full overflow-hidden bg-fundo/50 flex items-center justify-center">
                {product.imagemUrl ? (
                  <img 
                    src={product.imagemUrl} 
                    alt={product.nome} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'; }}
                  />
                ) : (
                  <span className="text-4xl">🍔</span>
                )}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-cinza hover:text-primary transition-colors shadow-sm">
                  <Heart size={20} />
                </button>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-[20px] text-marrom mb-2">{product.nome}</h3>
                <p className="text-cinza text-[14px] mb-4 flex-1">{product.descricao || 'Nenhuma descrição informada.'}</p>
                
                <div className="flex items-center gap-4 text-[14px] text-cinza mb-6 font-medium">
                  <span className="flex items-center text-primary">
                    <Star size={16} className="mr-1 fill-primary" /> 4.5
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="font-bold text-[22px] text-marrom">
                    R$ {(product.preco || 0).toFixed(2).replace('.', ',')}
                  </div>
                  <button className="bg-secondary text-marrom font-semibold px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-colors text-[16px]">
                    Pedir
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && products.length === 0 && (
             <div className="col-span-full text-center py-20 text-cinza text-[18px]">
               Nenhum produto encontrado nesta categoria.
             </div>
          )}
        </div>
      )}

      {/* Error Modal (Server error) */}
      {error && error !== 'UNAUTHORIZED' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setError(null)}
              className="absolute top-4 right-4 text-cinza hover:text-marrom"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-marrom mb-2">Ops! Algo deu errado.</h3>
              <p className="text-cinza mb-8">{error}</p>
              <button 
                onClick={loadProducts}
                className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-[#e5564f] transition-colors w-full"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
