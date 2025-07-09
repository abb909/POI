import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineAlert = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="offline-alert">
      <WifiOff className="wifi-off-icon" />
      <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.</span>
    </div>
  );
};

export default OfflineAlert;