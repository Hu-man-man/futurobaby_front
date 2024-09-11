"use client"

import { createContext, useState, useContext } from 'react';

type IsBornContextType = {
  isBorn: 'true' | 'false' | 'endOfPredictions';
  setIsBorn: (value: 'true' | 'false' | 'endOfPredictions') => void;
};

const IsBornContext = createContext<IsBornContextType | undefined>(undefined);

export const IsBornProvider = ({ children }: { children: React.ReactNode }) => {
  const [isBorn, setIsBorn] = useState<'true' | 'false' | 'endOfPredictions'>('false'); // Par défaut à 'false'

  return (
    <IsBornContext.Provider value={{ isBorn, setIsBorn }}>
      {children}
    </IsBornContext.Provider>
  );
};

export const useIsBorn = () => {
  const context = useContext(IsBornContext);
  if (!context) {
    throw new Error('useIsBorn must be used within a IsBornProvider');
  }
  return context;
};
