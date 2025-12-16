import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface DeliveryContextType {
  method: "Tại quán" | "Mang về" | null;
  setMethod: (m: "Tại quán" | "Mang về") => void;
}

const DeliveryContext = createContext<DeliveryContextType>({
  method: null,
  setMethod: () => {},
});

export const DeliveryProvider = ({ children }: { children: React.ReactNode }) => {
  const [method, setMethodState] = useState<"Tại quán" | "Mang về" | null>(null);

  useEffect(() => {
    const loadMethod = async () => {
      const saved = await AsyncStorage.getItem("deliveryMethod");
      if (saved) setMethodState(saved as "Tại quán" | "Mang về");
    };
    loadMethod();
  }, []);

  const setMethod = async (m: "Tại quán" | "Mang về") => {
    setMethodState(m);
    await AsyncStorage.setItem("deliveryMethod", m);
    
  };

  return (
    <DeliveryContext.Provider value={{ method, setMethod }}>
      {children}
    </DeliveryContext.Provider>
  );
};

export const useDelivery = () => useContext(DeliveryContext);
