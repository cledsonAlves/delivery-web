import React, { createContext, useState, ReactNode } from 'react';
import { CITIES } from '../constants';

export interface CityContextValue {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const CityContext = createContext<CityContextValue>({
  selectedCity: CITIES[0],
  setSelectedCity: () => {},
});

interface CityProviderProps {
  children: ReactNode;
}

export const CityProvider: React.FC<CityProviderProps> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>(CITIES[0]);

  return (
    <CityContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};