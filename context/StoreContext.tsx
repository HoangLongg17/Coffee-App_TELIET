// src/context/StoreContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface StoreContextType {
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("selectedStore").then((value) => {
      if (value) {
        try {
          const parsed = JSON.parse(value);
          setSelectedStoreState(parsed);
        } catch {
          // fallback nếu dữ liệu cũ chỉ là string
          setSelectedStoreState({
            id: "",
            name: value,
            address: "",
            phone: "",
          });
        }
      }
    });
  }, []);

  const setSelectedStore = (store: Store) => {
    setSelectedStoreState(store);
    AsyncStorage.setItem("selectedStore", JSON.stringify(store));
  };

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within a StoreProvider");
  return ctx;
};
