import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  image?: string; // chính là ImageBase64 từ Firebase
  size: "S" | "M" | "L";
  quantity: number;
  note?: string;
  unitPrice: number; // đơn giá, thay vì price tổng
}

export interface Promotion {
  id: string;
  Title: string;
  Description?: string;
  DiscountAmount?: number | null;
  MinOrderValue?: number;
  MinQuantity?: number; // thêm để check gift
  Terms?: string[];
  ExpiryDate?: string;
  IsActive?: boolean;
  ApplyMethod?: "manual" | "auto";
  DiscountType?: "fixed" | "percent" | "gift";
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: "S" | "M" | "L") => void;
  clearCart: () => void;
  appliedPromotion: Promotion | null;
  setAppliedPromotion: (promo: Promotion | null) => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  appliedPromotion: null,
  setAppliedPromotion: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id && p.size === item.size
      );
      if (existing) {
        return prev.map((p) =>
          p.id === item.id && p.size === item.size
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string, size?: "S" | "M" | "L") => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.id === id && (!size || p.size === size)
            ? { ...p, quantity: p.quantity - 1 }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromotion(null);
  };

  // ✅ Re‑validate promotion mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    if (!appliedPromotion) return;

    const totalValue = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const totalQty = cart.reduce((sum, i) => sum + i.quantity, 0);

    // Gift: check số lượng
    if (
      appliedPromotion.DiscountType === "gift" &&
      typeof appliedPromotion.MinQuantity === "number" &&
      totalQty < appliedPromotion.MinQuantity
    ) {
      setAppliedPromotion(null);
    }

    // Fixed/Percent: check giá trị tối thiểu
    if (
      (appliedPromotion.DiscountType === "fixed" ||
        appliedPromotion.DiscountType === "percent") &&
      typeof appliedPromotion.MinOrderValue === "number" &&
      totalValue < appliedPromotion.MinOrderValue
    ) {
      setAppliedPromotion(null);
    }
  }, [cart, appliedPromotion]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        appliedPromotion,
        setAppliedPromotion,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
