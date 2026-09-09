import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { MdCheck, MdClose, MdInfoOutline } from 'react-icons/md';

type NotificationType = 'success' | 'error' | 'info';

interface AppNotificationOptions {
  title?: string;
  message: string;
  type?: NotificationType;
  imageUrl?: string;
}

interface NotificationContextType {
  showNotification: (options: AppNotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useAppNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useAppNotification must be used within a NotificationProvider');
  }
  return context;
};

interface ActiveNotification extends AppNotificationOptions {
  id: string;
  visible: boolean;
}

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<ActiveNotification | null>(null);

  const showNotification = useCallback((options: AppNotificationOptions) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotification({ ...options, id, visible: true });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setNotification((prev) => (prev?.id === id ? { ...prev, visible: false } : prev));
      
      // Fully remove after animation
      setTimeout(() => {
        setNotification((prev) => (prev?.id === id ? null : prev));
      }, 600); // 600ms exit animation
    }, 3000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationWidget notification={notification} />
      )}
    </NotificationContext.Provider>
  );
};

const NotificationWidget: React.FC<{ notification: ActiveNotification }> = ({ notification }) => {
  const { title, message, type = 'info', imageUrl, visible } = notification;

  const getColors = () => {
    switch (type) {
      case 'success': return { bg: 'rgba(76, 175, 80, 0.15)', icon: '#4CAF50', IconComponent: MdCheck };
      case 'error': return { bg: 'rgba(229, 57, 53, 0.15)', icon: '#E53935', IconComponent: MdClose };
      case 'info':
      default: return { bg: 'rgba(33, 150, 243, 0.15)', icon: '#2196F3', IconComponent: MdInfoOutline };
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'success': return 'Sucesso';
      case 'error': return 'Atenção';
      case 'info': return 'Informação';
    }
  };

  const colors = getColors();
  const displayTitle = title || getDefaultTitle();

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px', // padding top + 16px equivalent
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-150%)',
        transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // elastic out
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '50px',
          padding: '12px',
          boxShadow: '0 10px 20px rgba(93, 32, 28, 0.1)', // #5D201C
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'auto',
          maxWidth: '90%',
        }}
      >
        {imageUrl ? (
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#FFF0EE',
              boxShadow: '0 2px 8px rgba(254, 100, 92, 0.2)', // #FE645C
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <colors.IconComponent size={24} color={colors.icon} />
          </div>
        )}

        <div style={{ marginLeft: '16px', marginRight: '8px', display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: '#9E9E9E', fontSize: '12px', fontWeight: 500, lineHeight: 1 }}>
            {displayTitle}
          </span>
          <span
            style={{
              color: '#5D201C',
              fontSize: '15px',
              fontWeight: 'bold',
              marginTop: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.2,
            }}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
};
