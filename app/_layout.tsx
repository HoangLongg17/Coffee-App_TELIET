import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { DeliveryProvider } from "@/context/DeliveryContext";
import { StoreProvider } from "@/context/StoreContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StoreProvider>
          <DeliveryProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </DeliveryProvider>
        </StoreProvider>
      </CartProvider>
    </AuthProvider>
  );
}
