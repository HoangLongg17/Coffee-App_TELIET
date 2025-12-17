// app/promotion/[id]/filter.tsx
import ProductCard from "@/components/ProductCard";
import { db } from "@/config/firebaseConfig";
import { useCart } from "@/context/CartContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Product {
  id: string;
  Name: string;
  Category?: string;
  ImageBase64?: string;
  Sizes?: { S?: number; M?: number; L?: number };
}

interface Promotion {
  id: string;
  Title: string;
  MinOrderValue?: number;   // dùng cho fixed/percent
  MinQuantity?: number;     // dùng cho gift (ví dụ mua >= 3)
  DiscountAmount ?: number | null;
  DiscountType?: "fixed" | "percent" | "gift";
  GiftQuantity?: number;
  GiftProductIds?: string[];
}

export default function PromotionFilterScreen() {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [selectedItems, setSelectedItems] = useState<
  { id: string; qty: number; size: "S" | "M" | "L" }[]
  >([]);
  const { addToCart, setAppliedPromotion } = useCart();
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L">("M");
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const promoSnap = await getDoc(doc(db, "Promotions", id as string));
      if (promoSnap.exists()) {
        setPromo({ id: promoSnap.id, ...promoSnap.data() } as Promotion);
      }
      const snap = await getDocs(collection(db, "Products"));
      const allProducts = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];
      setProducts(allProducts);
    };
    fetchData();
  }, [id]);

  const handleSelect = (productId: string) => {
    const existing = selectedItems.find(i => i.id === productId);
    if (existing) {
      setSelectedItems(
        selectedItems.map(i =>
          i.id === productId ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { id: productId, qty: 1, size: "M" }]);
    }
  };
  const handleRemove = (productId: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== productId));
  };

  const totalValue = selectedItems.reduce((sum, i) => {
  const p = products.find(p => p.id === i.id);
  return sum + (p?.Sizes?.[i.size] ?? 0) * i.qty;
  }, 0);
  const totalQty = selectedItems.reduce((sum, i) => sum + i.qty, 0);
  const pushSelectedToCart = () => {
    selectedItems.forEach((i) => {
      const p = products.find(p => p.id === i.id);
      if (p) {
        addToCart({
          id: p.id,
          name: String(p.Name ?? ""),
          image: p.ImageBase64,
          size: i.size,
          unitPrice: p.Sizes?.[i.size] ?? 0,
          quantity: i.qty,
        });
      }
    });
  };
  const [step, setStep] = useState<"selectProducts" | "selectGift">("selectProducts");
  const handleConfirm = () => {
  if (!promo) return;

  // Gift: điều kiện theo số lượng
  if (step === "selectProducts" && promo.DiscountType === "gift") { if (typeof promo.MinQuantity === "number" && totalQty >= promo.MinQuantity) {
    setStep("selectGift");
    return;
   }
  }
  if (step === "selectGift" && promo.DiscountType === "gift") {
    if (!selectedGift) {
      alert("Vui lòng chọn sản phẩm tặng!");
      return;
    }
    pushSelectedToCart();
    const giftProduct = products.find(p => p.id === selectedGift);
    if (giftProduct) { addToCart({
      id: giftProduct.id,
      name: String(giftProduct.Name ?? ""),
      image: giftProduct.ImageBase64,
      size: "S",
      unitPrice: 0,
      quantity: promo.GiftQuantity ?? 1,
      isGift: true,
    });
    }
      setAppliedPromotion(promo); router.replace("/order");
      return;
    }
  // Fixed: giảm số tiền cố định, cần MinOrderValue
  if (promo.DiscountType === "fixed") {
    if (typeof promo.MinOrderValue === "number" && totalValue >= promo.MinOrderValue) {
      pushSelectedToCart();
      setAppliedPromotion(promo);
      router.replace("/order");
    }
    return;
  }

  // Percent: giảm theo phần trăm, thường áp dụng cho sản phẩm thuộc Category nào đó
  if (promo.DiscountType === "percent") {
    // ví dụ: giảm cho sản phẩm Category = "Freeze"
    const discountedItems = selectedItems.map(i => {
      const p = products.find(p => p.id === i.id);
      if (!p) return null;
      let unitPrice = p.Sizes?.M ?? 0;
      // nếu sản phẩm thuộc Category Freeze thì giảm theo phần trăm
      if (p.Category === "Freeze" && typeof promo.DiscountAmount === "number") {
        unitPrice = Math.round(unitPrice * (1 - promo.DiscountAmount / 100));
      }
      return {
        id: p.id,
        name: String(p.Name ?? ""),
        image: p.ImageBase64,
        size: "M",
        unitPrice,
        quantity: i.qty,
      };
    }).filter(Boolean) as any[];

    discountedItems.forEach(item => addToCart(item));
    setAppliedPromotion(promo);
    router.replace("/order");
    return;
  }
};
return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.closeBtn}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {step === "selectProducts" ? "Chọn sản phẩm áp dụng" : "Chọn sản phẩm tặng"}
      </Text>
    </View>

    {/* Bước 1: chọn sản phẩm */}
    {step === "selectProducts" && (
      <>
        {promo?.DiscountType === "gift" && typeof promo.MinQuantity === "number" && (
          <Text style={styles.note}>
            Bạn cần chọn đủ {promo.MinQuantity} sản phẩm để nhận quà tặng.
          </Text>
        )}
        {typeof promo?.MinOrderValue === "number" && promo.MinOrderValue > 0 && (
          <Text style={styles.note}>
            Bạn cần chọn đủ {promo.MinOrderValue.toLocaleString("vi-VN")} ₫ để áp dụng mã này.
          </Text>
        )}

        {/* Grid sản phẩm */}
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              id={item.id}
              name={String(item.Name ?? "")}
              image={item.ImageBase64}
              price={item.Sizes?.M ?? 0}
              selected={!!selectedItems.find(i => i.id === item.id)}
              onPress={() => handleSelect(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: 16 }}
        />

        {/* Sản phẩm đã chọn */}
        <View style={styles.selectedBox}>
          <Text style={styles.subTitle}>Đã chọn:</Text>
          <ScrollView style={{ maxHeight: 150 }}>
            {selectedItems.map((i) => {
              const p = products.find(p => p.id === i.id);
              return (
                <View key={i.id} style={styles.selectedItem}>
                  {/* Tên sản phẩm */}
                  <Text style={styles.selectedName}>{String(p?.Name ?? "")}</Text>

                  {/* Chọn size */}
                  <View style={styles.sizeRow}>
                    {(["S","M","L"] as const).map(s => (
                      <TouchableOpacity
                        key={s}
                        onPress={() =>
                          setSelectedItems(selectedItems.map(si =>
                            si.id === i.id ? { ...si, size: s } : si
                          ))
                        }
                        style={[
                          styles.sizeBox,
                          i.size === s && styles.sizeBoxSelected
                        ]}
                      >
                        <Text style={{ color: i.size === s ? "#B22222" : "#333" }}>
                          {`${s} - ${(p?.Sizes?.[s] ?? 0).toLocaleString("vi-VN")} ₫`}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Controls số lượng */}
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => {
                        if (i.qty > 1) {
                          setSelectedItems(
                            selectedItems.map(si =>
                              si.id === i.id ? { ...si, qty: si.qty - 1 } : si
                            )
                          );
                        } else {
                          setSelectedItems(selectedItems.filter(si => si.id !== i.id));
                        }
                      }}
                    >
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyNumber}>{i.qty}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() =>
                        setSelectedItems(
                          selectedItems.map(si =>
                            si.id === i.id ? { ...si, qty: si.qty + 1 } : si
                          )
                        )
                      }
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Tổng cộng */}
        <View style={styles.totalBox}>
          <Text style={styles.totalText}>
            Tổng cộng: {totalValue.toLocaleString("vi-VN")} ₫
          </Text>
          {promo?.MinOrderValue && totalValue < promo.MinOrderValue && (
            <Text style={styles.missingText}>
              Còn thiếu {(promo.MinOrderValue - totalValue).toLocaleString("vi-VN")} ₫ để áp dụng mã
            </Text>
          )}
          {promo?.DiscountType === "gift" &&
            typeof promo.MinQuantity === "number" &&
            totalQty < promo.MinQuantity && (
              <Text style={styles.missingText}>
                Còn thiếu {promo.MinQuantity - totalQty} sản phẩm để nhận quà tặng
              </Text>
            )}
        </View>
      </>
    )}

    {/* Bước 2: chọn quà */}
    {step === "selectGift" && promo?.DiscountType === "gift" && Array.isArray(promo.GiftProductIds) && (
    <View style={{ padding: 16 }}>
      <Text style={styles.subTitle}>Chọn sản phẩm tặng:</Text>
      {promo.GiftProductIds.map(id => {
        const giftProduct = products.find(p => p.id === id);
        const isSelected = selectedGift === id;
        return giftProduct ? (
          <TouchableOpacity
            key={id}
            onPress={() => setSelectedGift(id)}
            style={[styles.giftOption, isSelected && styles.giftOptionSelected]}
          >
            {/* Ảnh sản phẩm */}
            {giftProduct.ImageBase64 && (
              <Image
                source={{ uri: giftProduct.ImageBase64 }}
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
                resizeMode="cover"
              />
            )}
            {/* Tên sản phẩm */}
            <Text style={styles.note}>{String(giftProduct?.Name ?? "")}</Text>
          </TouchableOpacity>
        ) : null;
      })}
    </View>
    )}
    {/* Nút xác nhận */}
    <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
      <Text style={{ color: "#fff", fontWeight: "bold" }}>
        {step === "selectProducts" ? "Xác nhận sản phẩm" : "Xác nhận quà tặng"}
      </Text>
    </TouchableOpacity>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeBtn: { fontSize: 20, fontWeight: "bold", color: "#B22222" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 16, fontWeight: "bold", color: "#333" },
  note: { padding: 16, fontSize: 13, color: "#666" },
  subTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  selectedBox: { padding: 16, borderTopWidth: 1, borderColor: "#eee" },
  selectedItem: {
    flexDirection: "column",   // ✅ đổi từ "row" sang "column"
    alignItems: "flex-start",  // ✅ căn trái cho gọn
    marginBottom: 12,          // ✅ khoảng cách vừa phải giữa các item
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  selectedName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,           // ✅ cách tên với block size
  },
  sizeRow: {
    flexDirection: "row",
    flexWrap: "wrap",          // ✅ cho phép xuống dòng nếu chật
    marginBottom: 6,
  },
  sizeBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  sizeBoxSelected: {
    borderColor: "#B22222",
    backgroundColor: "#ffecec",
  },
  qtyControls: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  qtyNumber: { marginHorizontal: 8, fontSize: 14, fontWeight: "600" },
  totalBox: { marginTop: 8 },
  totalText: { fontSize: 15, fontWeight: "bold", color: "#B22222" },
  missingText: { fontSize: 13, color: "#666", marginTop: 4 },
  confirmBtn: {
    backgroundColor: "#B22222",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
  giftOption: { 
  padding: 12,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  marginBottom: 8, },
  giftOptionSelected: {
    borderColor: "#B22222", backgroundColor: "#ffecec",
  },
});
