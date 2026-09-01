import { useState } from 'react';
import { ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [endereco, setEndereco] = useState<string>('');
  const apiKey =
    import.meta.env.VITE_GOOGLE_PLACES_API_KEY ||
    import.meta.env.GOOGLE_PLACES_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    import.meta.env.GOOGLE_API_KEY;

  const pegarLocalizacao = async () => {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização.');
      return;
    }

    if (!apiKey) {
      alert('A chave da API do Google não foi configurada. Verifique o arquivo .env na raiz do projeto.');
      return;
    }

    localStorage.removeItem('endereco_entrega');
    setEndereco('');
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        localStorage.removeItem('endereco_entrega');

        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=pt-BR&result_type=street_address|route|intersection|premise`
          );
          const data = await res.json();

          if (data.results && data.results.length > 0) {
            const resultados = data.results
              .filter((result: any) =>
                result.formatted_address &&
                (result.types.includes('street_address') ||
                  result.types.includes('route') ||
                  result.types.includes('intersection') ||
                  result.types.includes('premise'))
              )
              .sort((a: any, b: any) => (b.address_components?.length || 0) - (a.address_components?.length || 0));

            const resultadoExato = resultados[0] || data.results[0];
            const enderecoFormatado = resultadoExato.formatted_address;

            setEndereco(enderecoFormatado);
            localStorage.setItem('endereco_entrega', enderecoFormatado);
            navigate('/produtos');
          } else {
            alert('Não foi possível identificar o endereço. Verifique a chave do Google Places e as permissões da API.');
          }
        } catch {
          alert('Erro ao buscar o endereço. Tente novamente.');
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
        alert('Permissão de localização negada. Por favor, habilite nas configurações do navegador.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Hero Section */}
      <header className="bg-secondary p-12 rounded-[32px] shadow-sm flex items-center justify-between mb-12">
        <div className="max-w-xl">
          <h1 className="text-[32px] md:text-[48px] font-bold mb-4 text-marrom leading-tight">
            Bateu a fome? <br/>Pede um Nhac!
          </h1>
          <p className="text-[18px] text-marrom/80 mb-8">Descubra os melhores restaurantes e ofertas perto de você.</p>
          
          <button
            onClick={pegarLocalizacao}
            disabled={loadingLocation}
            className="flex items-center gap-3 bg-white text-marrom px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all font-semibold text-[18px] border border-transparent hover:border-primary/20 disabled:opacity-60"
          >
            {loadingLocation ? (
              <>
                <Loader2 size={24} className="animate-spin text-primary" />
                Buscando localização...
              </>
            ) : (
              <>
                <MapPin size={24} className="text-primary" />
                {endereco || 'Usar minha localização atual'}
              </>
            )}
          </button>
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
