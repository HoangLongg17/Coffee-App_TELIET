import BottomActionBar from "@/components/BottomActionBar";
import CategoryList from "@/components/CategoryList";
import { db } from "@/config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { useDelivery } from "@/context/DeliveryContext";
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
import { SafeAreaView } from "react-native-safe-area-context";
interface Product {
  id: string;
  Name: string;
  Description?: string;
  ImageBase64?: string;
  Category?: string;
  Sizes?: { S?: number; M?: number; L?: number };
}
export default function OrderScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TRÀ SỮA");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { method } = useDelivery();
  const { fromPromo, productId } = useLocalSearchParams();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const snap = await getDocs(collection(db, "Products"));
        const allProducts = snap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Product)
        );
        setProducts(allProducts);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // lắng nghe sự kiện cart:add để phát tiếp cart:animate cho FloatingCartButton
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("cart:add", () => {
      DeviceEventEmitter.emit("cart:animate");
    });
    return () => subscription.remove();
  }, []);

  const categories = [
    { name: "TRÀ SỮA", icon: require("@/assets/images/icon_TraSua.png") },
    { name: "FREEZE", icon: require("@/assets/images/icon_freeze.png") },
    { name: "CÀ PHÊ", icon: require("@/assets/images/icon_coffee.png") },
    { name: "TRÀ", icon: require("@/assets/images/icon_tea.png") },
  ];

  const getDisplayPrice = (p: Product) => {
    if (p.Sizes) {
      if (p.Sizes.M !== undefined) return p.Sizes.M;
      if (p.Sizes.S !== undefined) return p.Sizes.S;
      if (p.Sizes.L !== undefined) return p.Sizes.L;
    }
    return 0;
  };

  const filteredProducts = products.filter(
    (item) =>
      item.Category === selectedCategory &&
      item.Name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
  <SafeAreaView style={styles.container}>
    <TextInput
      placeholder="Tìm kiếm tên món ăn"
      value={search}
      onChangeText={setSearch}
      style={styles.searchInput}
    />

    <CategoryList
      categories={categories}
      selected={selectedCategory}
      onSelect={setSelectedCategory}
      navigateOnPress={false}
    />
    {method && (
      <View style={styles.methodBox}>
        <Text style={styles.methodText}>Phương thức giao hàng: {method}</Text>
      </View>
    )}

    <Text style={styles.sectionTitle}>{selectedCategory}</Text>

    {loading ? (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Đang tải sản phẩm...
      </Text>
    ) : (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === "list" ? (
          filteredProducts.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.push({ pathname: "/product/[id]", params: { id: item.id } })
              }
            >
              <View style={styles.itemBox}>
                {item.ImageBase64 && (
                  <Image
                    source={{ uri: item.ImageBase64 }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.Name}</Text>
                  {item.Description && (
                    <Text style={styles.itemDesc}>{item.Description}</Text>
                  )}
                  <Text style={styles.itemPrice}>
                    {getDisplayPrice(item).toLocaleString("vi-VN")} ₫
                  </Text>
                  <Text style={styles.itemCode}>Mã: {item.id}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {filteredProducts.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push({ pathname: "/product/[id]", params: { id: item.id } })
                }
                style={styles.itemGrid}
              >
                {item.ImageBase64 && (
                  <Image
                    source={{ uri: item.ImageBase64 }}
                    style={styles.itemGridImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.Name}
                </Text>
                <Text style={styles.itemPrice}>
                  {getDisplayPrice(item).toLocaleString("vi-VN")} ₫
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    )}

    {/* Cụm cố định phía dưới */}
    <BottomActionBar hasTabBar />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  fixedBottom: {
  position: "absolute",
  bottom: 16,
  left: 16,
  right: 16,
  },
  fixedBottomRow: {
  position: "absolute",
  bottom: 16,
  left: 16,
  right: 16,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 10,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},
locationInline: {
  flexDirection: "row",
  alignItems: "center",
},
locationIcon: {
  width: 20,
  height: 20,
  tintColor: "#B22222",
  marginRight: 8,
},
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 8 },
  itemBox: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  itemDesc: { fontSize: 13, color: "gray", marginBottom: 4 },
  itemPrice: { fontSize: 15, color: "#d00000", fontWeight: "bold" },
  itemCode: { fontSize: 12, color: "#888" },
  itemGrid: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemGridImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationBox: {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 8,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: "#ccc",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B22222",
  },
  methodBox: {
  backgroundColor: "#fff",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#ccc",
  marginBottom: 12,
  },
  methodText: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#B22222",
  },

});
