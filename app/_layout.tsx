import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { DeliveryProvider } from "@/context/DeliveryContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { StoreProvider } from "@/context/StoreContext";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AuthProvider>
      <CartProvider>
        <StoreProvider>
          <DeliveryProvider>
            <LoadingProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </LoadingProvider>
          </DeliveryProvider>
        </StoreProvider>
      </CartProvider>
    </AuthProvider>
  );
}
