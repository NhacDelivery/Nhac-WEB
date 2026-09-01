import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../assets/loading_nhac.json';
import { fetchProdutos, Produto } from '../services/api';
import AddressPicker from '../components/AddressPicker';

// Material Design Icons
import { MdLocationOn, MdSearch, MdTune, MdAdd, MdClose, MdErrorOutline, MdLogin, MdChevronLeft, MdChevronRight, MdMyLocation } from 'react-icons/md';

// Banner data (same as Flutter project)
const BANNERS = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=400&fit=crop',
    categoria: 'Prato Principal',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&h=400&fit=crop',
    categoria: 'Combos',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1200&h=400&fit=crop',
    categoria: 'Bebidas',
  },
];

const categories = ['Todos', 'Lanches', 'Pizza', 'Combos', 'Bebidas', 'Doces', 'Saudável'];

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentBanner, setCurrentBanner] = useState<number>(0);
  const [endereco, setEndereco] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [addressPickerOpen, setAddressPickerOpen] = useState<boolean>(false);
  const bannerInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const apiKey =
    import.meta.env.VITE_GOOGLE_PLACES_API_KEY ||
    import.meta.env.GOOGLE_PLACES_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    import.meta.env.GOOGLE_API_KEY;

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setEndereco('Seu navegador não suporta geolocalização.');
      return;
    }

    localStorage.removeItem('endereco_entrega');
    setEndereco('');
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=pt-BR`
          );
          const data = await response.json();

          const formattedAddress = data.results?.[0]?.formatted_address;

          if (formattedAddress) {
            setEndereco(formattedAddress);
            localStorage.setItem('endereco_entrega', formattedAddress);
          } else {
            setEndereco('Localização atual indisponível.');
          }
        } catch {
          setEndereco('Não foi possível obter sua localização atual.');
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
        setEndereco('Ative a permissão de localização para continuar.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [apiKey]);

  useEffect(() => {
    const savedAddress = localStorage.getItem('endereco_entrega');
    if (savedAddress) {
      setEndereco(savedAddress);
    }

    getCurrentLocation();
  }, [getCurrentLocation]);

  const handleAddressSelected = (selectedAddress: string) => {
    setEndereco(selectedAddress);
    localStorage.setItem('endereco_entrega', selectedAddress);
    setAddressPickerOpen(false);
  };

  // Auto-play banner carousel
  useEffect(() => {
    bannerInterval.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => {
      if (bannerInterval.current) clearInterval(bannerInterval.current);
    };
  }, []);

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
        setError('Não foi possível conectar ao servidor. O backend pode estar em repouso (Render).');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = searchTerm
    ? products.filter((p) =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const goToBanner = (index: number) => {
    setCurrentBanner(index);
    if (bannerInterval.current) clearInterval(bannerInterval.current);
    bannerInterval.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
  };

  // ─── UNAUTHORIZED ───
  if (error === 'UNAUTHORIZED') {
    return (
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="bg-white p-12 rounded-[32px] shadow-sm text-center max-w-lg mx-auto border border-primary/20">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <MdLogin size={40} />
          </div>
          <h3 className="text-2xl font-bold text-marrom mb-4">Acesso Restrito</h3>
          <p className="text-cinza mb-8 text-[16px]">
            Você precisa fazer login para visualizar o nosso cardápio de delícias.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-[#e5564f] transition-colors inline-flex items-center gap-2"
          >
            <MdLogin size={24} /> Fazer Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
      {/* ─── Location Bar ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <MdLocationOn className="text-primary" size={28} />
          <div>
            <p className="text-cinza text-[13px]">Sua Localização</p>
            <p className="text-marrom font-semibold text-[16px] truncate max-w-sm">
              {loadingLocation ? 'Buscando sua localização...' : endereco}
            </p>
          </div>
          <button
            onClick={() => setAddressPickerOpen(true)}
            className="text-primary font-semibold text-[14px] ml-2 hover:underline whitespace-nowrap"
          >
            Mudar &gt;
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center bg-white rounded-2xl border border-secondary shadow-sm w-full lg:max-w-md">
          <MdSearch className="absolute left-4 text-cinza" size={24} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Procurar"
            className="w-full py-3 pl-12 pr-12 rounded-2xl bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-marrom"
          />
          <MdTune className="absolute right-4 text-cinza cursor-pointer hover:text-primary transition-colors" size={22} />
        </div>
      </div>

      {/* ─── Banner Carousel ─── */}
      <div className="relative mb-8 overflow-hidden rounded-[24px] group">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {BANNERS.map((banner, i) => (
            <div key={i} className="min-w-full relative">
              <img
                src={banner.imageUrl}
                alt={banner.categoria}
                className="w-full h-[220px] lg:h-[300px] object-cover rounded-[24px]"
              />
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => goToBanner((currentBanner - 1 + BANNERS.length) % BANNERS.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MdChevronLeft size={28} className="text-marrom" />
        </button>
        <button
          onClick={() => goToBanner((currentBanner + 1) % BANNERS.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MdChevronRight size={28} className="text-marrom" />
        </button>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4 absolute bottom-4 w-full">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToBanner(i)}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                i === currentBanner
                  ? 'w-5 bg-marrom'
                  : 'w-[6px] bg-marrom/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── Category Filters ─── */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            disabled={loading}
            className={`px-6 py-2.5 rounded-full text-[14px] font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-marrom hover:bg-secondary/50 border border-secondary'
            } disabled:opacity-50`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ─── Section Title ─── */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-bold text-marrom">Temos tudo que você precisa</h2>
        <button className="text-primary font-semibold text-[14px] hover:underline">
          Ver tudo
        </button>
      </div>

      {/* ─── Loading ─── */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="w-64 h-64">
            <Player src={loadingAnimation} loop autoplay />
          </div>
          <p className="text-primary font-bold text-lg mt-4 animate-pulse">
            Preparando as delícias...
          </p>
        </div>
      ) : (
        /* ─── Product Grid ─── */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-transparent hover:border-primary/30 flex flex-col group cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden bg-fundo/50 flex items-center justify-center">
                {product.imagemUrl ? (
                  <img
                    src={product.imagemUrl}
                    alt={product.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e: any) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                    }}
                  />
                ) : (
                  <span className="text-5xl">🍔</span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-[16px] text-marrom mb-1 truncate">
                  {product.nome}
                </h3>

                <div className="flex items-center justify-between mt-auto pt-3">
                  <div className="font-bold text-[18px] text-marrom">
                    R$ {(product.preco || 0).toFixed(2).replace('.', ',')}
                  </div>
                  <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-[#e5564f] transition-colors shadow-sm">
                    <MdAdd size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20 text-cinza text-[18px]">
              Nenhum produto encontrado.
            </div>
          )}
        </div>
      )}

      {/* ─── Error Modal (Server error) ─── */}
      {error && error !== 'UNAUTHORIZED' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setError(null)}
              className="absolute top-4 right-4 text-cinza hover:text-marrom"
            >
              <MdClose size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                <MdErrorOutline size={32} />
              </div>
              <h3 className="text-2xl font-bold text-marrom mb-2">
                Ops! Algo deu errado.
              </h3>
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

      <AddressPicker
        isOpen={addressPickerOpen}
        onClose={() => setAddressPickerOpen(false)}
        onAddressSelected={handleAddressSelected}
      />
    </div>
  );
}
