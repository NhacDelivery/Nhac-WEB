import { ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Hero Section */}
      <header className="bg-secondary p-12 rounded-[32px] shadow-sm flex items-center justify-between mb-12">
        <div className="max-w-xl">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4 text-marrom leading-tight">
            Bateu a fome? <br/>Pede um Nhac!
          </h1>
          <p className="text-[18px] text-marrom/80 mb-8">Descubra os melhores restaurantes e ofertas perto de você.</p>
          
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Buscar restaurantes ou itens..." 
              className="w-full py-4 pl-12 pr-4 rounded-full bg-white border border-transparent focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-marrom"
            />
            <Search className="absolute left-4 top-4 text-cinza" size={24} />
          </div>
        </div>
        <div className="hidden lg:block text-[160px]">🍔</div>
      </header>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-[28px] font-bold mb-6">Categorias Populares</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {['Lanches', 'Pizza', 'Saudável', 'Bebidas', 'Doces'].map((cat, i) => (
            <div key={i} className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-sm flex-1 min-w-[150px] hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-primary/20">
              <div className="text-[48px] mb-4">
                {['🍔', '🍕', '🥗', '🥤', '🍩'][i]}
              </div>
              <span className="text-[18px] font-semibold text-marrom">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Banner */}
      <section>
        <Link to="/produtos">
          <div className="bg-primary rounded-[32px] p-10 flex items-center justify-between text-white shadow-md hover:shadow-lg transition-shadow">
            <div>
              <h3 className="font-bold text-[36px] mb-2">Ofertas Imperdíveis!</h3>
              <p className="text-[18px] mb-8 opacity-90">Descontos de até 50% nos melhores pratos</p>
              <span className="bg-white text-primary text-[18px] px-8 py-4 rounded-full font-bold flex items-center w-max shadow-sm hover:bg-secondary transition-colors">
                Ver cardápio <ArrowRight size={24} className="ml-2" />
              </span>
            </div>
            <div className="text-[100px] hidden md:block">🛵</div>
          </div>
        </Link>
      </section>
    </div>
  );
}
