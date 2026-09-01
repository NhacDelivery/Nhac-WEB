import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MdLocationOn, MdClose, MdSearchOff, MdClear } from 'react-icons/md';
import { Player } from '@lottiefiles/react-lottie-player';
import loadingAnimation from '../assets/loading_nhac.json';

interface Suggestion {
  description: string;
  place_id: string;
  main_text: string;
  secondary_text: string;
}

interface AddressPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelected: (address: string) => void;
}

export default function AddressPicker({ isOpen, onClose, onAddressSelected }: AddressPickerProps) {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiKey =
    import.meta.env.VITE_GOOGLE_PLACES_API_KEY ||
    import.meta.env.GOOGLE_PLACES_API_KEY ||
    import.meta.env.VITE_GOOGLE_API_KEY ||
    import.meta.env.GOOGLE_API_KEY;

  const ensureGoogleMapsLoaded = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const googleWindow = window as typeof window & {
        google?: any;
      };

      if (googleWindow.google?.maps?.places) {
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[data-google-maps="nhac"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=pt-BR`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps', 'nhac');
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps failed to load'));
      document.head.appendChild(script);
    });
  }, [apiKey]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
    if (!isOpen) {
      setQuery('');
      setSuggestions([]);
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const searchAddresses = useCallback((text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!text.trim()) {
      setSuggestions([]);
      setIsTyping(false);
      setIsLoading(false);
      return;
    }

    if (!apiKey) {
      setSuggestions([]);
      setIsTyping(false);
      setIsLoading(false);
      return;
    }

    setIsTyping(true);
    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        await ensureGoogleMapsLoaded();

        const googleWindow = window as typeof window & {
          google?: any;
        };

        if (!googleWindow.google?.maps?.places?.AutocompleteService) {
          setSuggestions([]);
          return;
        }

        const service = new googleWindow.google.maps.places.AutocompleteService();

        service.getPlacePredictions(
          {
            input: text,
            componentRestrictions: { country: 'br' },
            types: ['address'],
          },
          (predictions: any[], status: string) => {
            if (status === googleWindow.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSuggestions(
                predictions.map((p: any) => ({
                  description: p.description,
                  place_id: p.place_id,
                  main_text: p.structured_formatting?.main_text || p.description.split(',')[0],
                  secondary_text: p.structured_formatting?.secondary_text || p.description,
                }))
              );
            } else {
              setSuggestions([]);
            }
            setIsLoading(false);
          }
        );
      } catch {
        setSuggestions([]);
        setIsLoading(false);
      }
    }, 500);
  }, [apiKey, ensureGoogleMapsLoaded]);

  const handleSelect = async (placeId: string) => {
    if (!apiKey) return;

    setIsLoading(true);
    try {
      await ensureGoogleMapsLoaded();

      const googleWindow = window as typeof window & {
        google?: any;
      };

      const geocoder = new googleWindow.google.maps.Geocoder();
      geocoder.geocode({ placeId }, (results: any[], status: string) => {
        if (status === googleWindow.google.maps.GeocoderStatus.OK && results?.[0]) {
          const result = results[0];
          const addressComponents = result.address_components || [];

          let rua = '';
          let numero = '';
          let bairro = '';
          let cidade = '';
          let estado = '';

          for (const component of addressComponents) {
            const types = component.types || [];

            if (types.includes('route')) rua = component.long_name;
            if (types.includes('street_number')) numero = component.long_name;
            if (types.includes('sublocality') || types.includes('sublocality_level_1') || types.includes('neighborhood')) bairro = component.long_name;
            if (types.includes('administrative_area_level_2')) cidade = component.long_name;
            if (types.includes('administrative_area_level_1')) estado = component.short_name;
          }

          const formatted = [rua, numero, bairro, cidade, estado]
            .filter(Boolean)
            .join(', ')
            .replace(/,\s*,/g, ',')
            .trim();

          const finalAddress = formatted || result.formatted_address || result.name;
          localStorage.setItem('endereco_entrega', finalAddress);
          onAddressSelected(finalAddress);
          onClose();
        }
        setIsLoading(false);
      });
    } catch {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    searchAddresses(val);
  };

  const handleManualAddress = () => {
    const value = query.trim();
    if (!value) return;

    localStorage.setItem('endereco_entrega', value);
    onAddressSelected(value);
    onClose();
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setIsTyping(false);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <div />
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
          <button onClick={onClose} className="text-cinza hover:text-marrom transition-colors">
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h2 className="text-[22px] font-bold text-marrom mb-2">
            Onde você quer receber o seu pedido?
          </h2>
          <p className="text-cinza text-[14px] mb-6">
            Busque pelo nome da rua e pelo número do seu endereço.
          </p>

          {/* Search input */}
          <div className="relative border-b-2 border-gray-300 focus-within:border-primary transition-colors mb-6">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Nome da rua e número"
              className="w-full py-3 pr-10 bg-transparent focus:outline-none text-marrom font-semibold placeholder:text-gray-300 placeholder:font-normal"
            />
            {query && (
              <button
                onClick={clearInput}
                className="absolute right-0 top-3 text-cinza hover:text-marrom"
              >
                <MdClear size={20} />
              </button>
            )}
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-36 h-36">
                <Player src={loadingAnimation} loop autoplay />
              </div>
            </div>
          ) : suggestions.length === 0 && isTyping ? (
            <div className="flex flex-col items-center py-10 text-cinza">
              <MdSearchOff size={48} className="text-gray-200 mb-4" />
              <p>Nenhum endereço encontrado</p>
              {query.trim() && (
                <button
                  onClick={handleManualAddress}
                  className="mt-4 bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-[#e5564f] transition-colors"
                >
                  Usar: {query.trim()}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {suggestions.map((item) => (
                <button
                  key={item.place_id}
                  onClick={() => handleSelect(item.place_id)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-fundo transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MdLocationOn size={20} className="text-cinza" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-[15px] text-marrom truncate">
                      {item.main_text}
                    </p>
                    <p className="text-cinza text-[13px] truncate">
                      {item.secondary_text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
