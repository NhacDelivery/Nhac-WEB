import { useState } from 'react';
import { Star, Clock, Heart } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 1, name: 'X-Bacon Especial', desc: 'Hambúrguer artesanal, bacon crocante, queijo cheddar e molho especial', price: 28.90, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400&h=300', rating: 4.8, time: '20-30 min' },
  { id: 2, name: 'Pizza Margherita', desc: 'Molho de tomate fresco, mussarela, manjericão e azeite', price: 45.00, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400&h=300', rating: 4.9, time: '40-50 min' },
  { id: 3, name: 'Salada Fit de Frango', desc: 'Mix de folhas, frango grelhado, tomate cereja e molho de mostarda', price: 22.50, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400&h=300', rating: 4.5, time: '15-25 min' },
  { id: 4, name: 'Açaí na Tigela', desc: 'Açaí 500ml com leite condensado, banana, morango e granola', price: 18.00, img: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&q=80&w=400&h=300', rating: 4.7, time: '10-20 min' },
  { id: 5, name: 'Combo Casal', desc: '2 X-Salada, 2 Fritas médias e 1 Refri 1L', price: 55.90, img: 'https://images.unsplash.com/photo-1594212848116-b8db20f171bc?auto=format&fit=crop&q=80&w=400&h=300', rating: 4.6, time: '25-35 min' },
  { id: 6, name: 'Bolo de Chocolate', desc: 'Fatia de bolo super recheado com brigadeiro belga', price: 15.00, img: 'https://images.unsplash.com/photo-1578985545062-69928b1ea342?auto=format&fit=crop&q=80&w=400&h=300', rating: 4.9, time: '10-15 min' }
];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const categories = ['Todos', 'Lanches', 'Pizzas', 'Saudável', 'Doces'];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold text-marrom mb-6">Nosso Cardápio</h1>
        
        {/* Category Filters */}
        <div className="flex gap-4 border-b border-secondary pb-6 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full text-[16px] font-semibold transition-all whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white text-marrom hover:bg-secondary/50 border border-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {MOCK_PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/30 flex flex-col group">
            <div className="relative h-56 w-full overflow-hidden">
              <img 
                src={product.img} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-cinza hover:text-primary transition-colors shadow-sm">
                <Heart size={20} />
              </button>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-bold text-[20px] text-marrom mb-2">{product.name}</h3>
              <p className="text-cinza text-[14px] mb-4 flex-1">{product.desc}</p>
              
              <div className="flex items-center gap-4 text-[14px] text-cinza mb-6 font-medium">
                <span className="flex items-center text-primary">
                  <Star size={16} className="mr-1 fill-primary" /> {product.rating}
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" /> {product.time}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="font-bold text-[22px] text-marrom">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </div>
                <button className="bg-secondary text-marrom font-semibold px-6 py-2.5 rounded-full hover:bg-primary hover:text-white transition-colors text-[16px]">
                  Pedir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
