import React, {
  useRef,
  useState,
  useMemo,
  useCallback,
  useContext,
  createContext,
} from 'react';

export const PriceContext = createContext({
  priceGroup: null,
});

export default function PriceProviderClient({priceGroup, children}) {
  const contextValue = useMemo(() => {
    return {
      priceGroup,
    };
  }, [priceGroup]);

  return (
    <PriceContext.Provider value={contextValue}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrice() {
  return useContext(PriceContext);
}
