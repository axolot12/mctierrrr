import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export const useInitializeApp = () => {
  const { initializeData, subscribeToRealtime, isLoading } = useAppStore();

  useEffect(() => {
    initializeData();
    const unsubscribe = subscribeToRealtime();
    return () => unsubscribe();
  }, [initializeData, subscribeToRealtime]);

  return { isLoading };
};
