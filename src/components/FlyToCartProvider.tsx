import React, { createContext, useContext, useState, useRef, ReactNode, useCallback } from 'react';

interface FlyToCartContextType {
  fly: (originRect: DOMRect, imageUrl: string) => void;
  cartIconRef: React.RefObject<HTMLElement | null>;
}

const FlyToCartContext = createContext<FlyToCartContextType | null>(null);

export const useFlyToCart = () => {
  const context = useContext(FlyToCartContext);
  if (!context) {
    throw new Error('useFlyToCart must be used within a FlyToCartProvider');
  }
  return context;
};

interface FlyingItem {
  id: string;
  origin: DOMRect;
  imageUrl: string;
}

export const FlyToCartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  const cartIconRef = useRef<HTMLElement | null>(null);

  const fly = useCallback((originRect: DOMRect, imageUrl: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFlyingItems((prev) => [...prev, { id, origin: originRect, imageUrl }]);
    
    // Remove after animation finishes (550ms in Flutter)
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((item) => item.id !== id));
      // Bounce the cart icon a little
      if (cartIconRef.current) {
        cartIconRef.current.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.2)' },
            { transform: 'scale(1)' }
          ],
          { duration: 300, easing: 'ease-out' }
        );
      }
    }, 550);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ fly, cartIconRef }}>
      {children}
      {flyingItems.map((item) => (
        <FlyingWidget key={item.id} item={item} cartIconRef={cartIconRef} />
      ))}
    </FlyToCartContext.Provider>
  );
};

const FlyingWidget: React.FC<{ item: FlyingItem; cartIconRef: React.RefObject<HTMLElement | null> }> = ({ item, cartIconRef }) => {
  const cartRect = cartIconRef.current?.getBoundingClientRect();

  if (!cartRect) return null;

  const startX = item.origin.left + item.origin.width / 2;
  const startY = item.origin.top + item.origin.height / 2;
  const endX = cartRect.left + cartRect.width / 2;
  const endY = cartRect.top + cartRect.height / 2;


  const elRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!elRef.current) return;


    const el = elRef.current;
    
    const duration = 550;
    const startSize = Math.min(item.origin.width, 50);
    const endSize = 15; // scales down to 0.3 of 50 = 15
    
    const frames = 20;
    const keyframes = [];

    // easeInOutCubic formula: t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeIn = (t: number) => t * t;

    for (let i = 0; i <= frames; i++) {
      const t = i / frames;
      const curvedT = easeInOutCubic(t);
      
      const x = startX + (endX - startX) * curvedT;
      const linearY = startY + (endY - startY) * curvedT;
      
      const arcHeight = 120; // 120px arc
      const parabola = -4 * curvedT * (curvedT - 1);
      const y = linearY - (arcHeight * parabola);
      
      const scale = 1.0 - 0.7 * easeIn(t);
      const opacity = t < 0.75 ? 1.0 : Math.max(0, 1.0 - (t - 0.75) / 0.25);
      const rotation = -0.25 * easeIn(t) * 360; // deg

      keyframes.push({
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
        opacity: opacity,
      });
    }

    el.animate(keyframes, {
      duration,
      fill: 'forwards'
    });

  }, [startX, startY, endX, endY]);

  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '50px',
        height: '50px',
        marginLeft: '-25px',
        marginTop: '-25px',
        pointerEvents: 'none',
        zIndex: 9999,
        borderRadius: '50%',
        boxShadow: '0 4px 12px rgba(254, 100, 92, 0.4)', // FE645C with opacity
      }}
    >
      <img 
        src={item.imageUrl} 
        alt="flying" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '50%'
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
        }}
      />
    </div>
  );
};
