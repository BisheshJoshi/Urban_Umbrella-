import React, { createContext, useContext, useState, useCallback } from "react";

interface TourContextType {
  isTourActive: boolean;
  startTour: () => void;
  stopTour: () => void;
}

const TourContext = createContext<TourContextType>({
  isTourActive: false,
  startTour: () => {},
  stopTour: () => {},
});

export const useTour = () => useContext(TourContext);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isTourActive, setIsTourActive] = useState(false);

  const startTour = useCallback(() => {
    setIsTourActive(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsTourActive(false);
  }, []);

  return (
    <TourContext.Provider value={{ isTourActive, startTour, stopTour }}>
      {children}
    </TourContext.Provider>
  );
}
