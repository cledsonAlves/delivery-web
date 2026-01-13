import React, { createContext } from 'react';

export interface CityContextValue {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

export const CityContext = createContext<CityContextValue>({
  selectedCity: 'Jarinu - SP',
  setSelectedCity: () => {},
});
