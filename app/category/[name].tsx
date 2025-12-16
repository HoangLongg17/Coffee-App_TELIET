import BottomActionBar from "@/components/BottomActionBar";
import { useDelivery } from "@/context/DeliveryContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";
interface Product {
  id: string;
  Name: string;
  Description?: string;
  ImageBase64?: string;
  Category?: string;
  Sizes?: { S?: number; M?: number; L?: number };
}

const getDisplayPrice = (p: Product) => {
  if (p.Sizes) {
    if (p.Sizes.M !== undefined) return p.Sizes.M;
    if (p.Sizes.S !== undefined) return p.Sizes.S;
    if (p.Sizes.L !== undefined) return p.Sizes.L;
  }
  return 0;
};

export default function CategoryScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { method } = useDelivery();
  
  useEffect(() => {
    const fetchProducts = async () => {
      const snap = await getDocs(collection(db, "Products"));
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      const filtered = all.filter(p =>
        p.Category === name &&
        (searchText === "" || p.Name.toLowerCase().includes(searchText.toLowerCase()))
      );
      setProducts(filtered);
    };
    fetchProducts();
  }, [name, searchText]);

  // lắng nghe sự kiện cart:add để phát tiếp cart:animate cho FloatingCartButton
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("cart:add", () => {
      DeviceEventEmitter.emit("cart:animate");
    });
    return () => subscription.remove();
  }, []);
  const styles = StyleSheet.create({
  methodBox: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B22222",
  },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={require("@/assets/images/icon_exit.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Image
            source={require("@/assets/images/icon_search.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
      </View>
      {method && (
      <View style={styles.methodBox}>
        <Text style={styles.methodText}>Phương thức giao hàng: {method}</Text>
      </View>
      )}
      
      {/* Thanh tìm kiếm */}
      {showSearch && (
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <TextInput
            placeholder="Tìm kiếm tên món..."
            value={searchText}
            onChangeText={setSearchText}
            style={{
              backgroundColor: "#f0f0f0",
              padding: 10,
              borderRadius: 8,
            }}
          />
        </View>
      )}

      {/* Chuyển chế độ hiển thị */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingHorizontal: 16,
          marginBottom: 8,
        }}
      >
        {/* Icon list */}
        <TouchableOpacity
          onPress={() => setViewMode("list")}
          style={{ marginRight: 12 }}
        >
          <Image
            source={require("@/assets/images/icon_list.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: viewMode === "list" ? "#B22222" : "gray",
            }}
          />
        </TouchableOpacity>

        {/* Icon grid */}
        <TouchableOpacity onPress={() => setViewMode("grid")}>
          <Image
            source={require("@/assets/images/icon_grid.png")}
            style={{
              width: 24,
              height: 24,
              tintColor: viewMode === "grid" ? "#B22222" : "gray",
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Danh sách sản phẩm */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
      >
        {viewMode === "list" ? (
          products.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.push({ pathname: "/product/[id]", params: { id: item.id } })
              }
            >
              <View
                style={{
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
                }}
              >
                {item.ImageBase64 && (
                  <Image
                    source={{ uri: item.ImageBase64 }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                    resizeMode="cover"
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginBottom: 4,
                    }}
                  >
                    {item.Name}
                  </Text>
                  {item.Description && (
                    <Text
                      style={{ fontSize: 13, color: "gray", marginBottom: 4 }}
                    >
                      {item.Description}
                    </Text>
                  )}
                  <Text
                    style={{
                      color: "#ff3b30",
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    {getDisplayPrice(item).toLocaleString("vi-VN")}₫
                  </Text>
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
            {products.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push({ pathname: "/product/[id]", params: { id: item.id } })
                }
                style={{
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
                }}
              >
                {item.ImageBase64 && (
                  <Image
                    source={{ uri: item.ImageBase64 }}
                    style={{
                      width: "100%",
                      height: 100,
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                )}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    marginBottom: 4,
                  }}
                  numberOfLines={2}
                >
                  {item.Name}
                </Text>
                <Text
                  style={{
                    color: "#ff3b30",
                    fontSize: 13,
                    fontWeight: "600",
                  }}
                >
                  {getDisplayPrice(item).toLocaleString("vi-VN")}₫
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Giỏ hàng cố định */}
      <BottomActionBar />
    </SafeAreaView>
  );
}
