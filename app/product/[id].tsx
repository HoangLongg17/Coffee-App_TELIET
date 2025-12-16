import { db } from "@/config/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<"S" | "M" | "L">("M");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, "Products", String(id));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProduct(snap.data());
      }
    };
    fetchProduct();
  }, [id]);

  const getPrice = () => {
    if (!product?.Sizes || !selectedSize) return 0;
    return product.Sizes[selectedSize] || 0;
  };

const handleAddToCart = () => {
  if (!user) {
    router.replace("/welcome");
    return;
  }

  const item = {
    id: String(id),
    name: product.Name,
    image: product.ImageBase64,
    size: selectedSize,
    quantity,
    note,
    unitPrice: getPrice(), // chỉ đơn giá
  };

  addToCart(item);

  // phát sự kiện để FloatingCartButton ở trang trước chạy animation
  DeviceEventEmitter.emit("cart:add", item);

  // quay về trang trước ngay
  router.back();
};

  if (!product) return <Text style={{ padding: 16 }}>Đang tải sản phẩm...</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {product.ImageBase64 && (
        <Image
          source={{ uri: product.ImageBase64 }}
          style={{ width: "100%", height: 200, borderRadius: 12, marginBottom: 16 }}
          resizeMode="cover"
        />
      )}
      <Text style={styles.name}>{product.Name}</Text>
      <Text style={styles.desc}>{product.Description}</Text>
      <Text style={styles.code}>Mã: {id}</Text>

      {/* Chọn size */}
      <View style={styles.sizeRow}>
        {["S", "M", "L"].map(
          (size) =>
            product.Sizes?.[size] && (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.sizeSelected,
                ]}
                onPress={() => setSelectedSize(size as "S" | "M" | "L")}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: selectedSize === size ? "#fff" : "#000",
                  }}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            )
        )}
      </View>

      {/* Ghi chú */}
      <Text style={styles.label}>Ghi chú (không bắt buộc)</Text>
      <TextInput
        placeholder="Ghi chú"
        value={note}
        onChangeText={setNote}
        style={styles.noteInput}
      />

      {/* Số lượng */}
      <View style={styles.quantityRow}>
        <TouchableOpacity
          onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          style={styles.qtyButton}
        >
          <Text style={{ fontSize: 18 }}>−</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, marginHorizontal: 12 }}>{quantity}</Text>
        <TouchableOpacity
          onPress={() => setQuantity((q) => q + 1)}
          style={styles.qtyButton}
        >
          <Text style={{ fontSize: 18 }}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Nút thêm */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
        <Text style={styles.addText}>
          THÊM {(getPrice() * quantity).toLocaleString("vi-VN")} đ
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  desc: { fontSize: 14, color: "#555", marginBottom: 8 },
  code: { fontSize: 12, color: "#888", marginBottom: 12 },
  sizeRow: { flexDirection: "row", marginBottom: 16 },
  sizeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
  },
  sizeSelected: {
    backgroundColor: "#B22222",
    borderColor: "#B22222",
  },
  label: { fontSize: 14, marginBottom: 4 },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButton: {
    backgroundColor: "#B22222",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
