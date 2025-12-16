// app/stores.tsx
import DeliveryMethodSelector from "@/components/DeliveryMethodSelector";
import { db } from "@/config/firebaseConfig";
import { useDelivery } from "@/context/DeliveryContext";
import { useStore } from "@/context/StoreContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  isActive?: boolean;
}

export default function StoreListScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchText, setSearchText] = useState("");
  const [showDeliveryMethod, setShowDeliveryMethod] = useState(false);
  const router = useRouter();
  const { selectedStore, setSelectedStore } = useStore(); // sẽ lưu cả object Store
  const { setMethod } = useDelivery();
  const { returnTo } = useLocalSearchParams();

  useEffect(() => {
    const fetchStores = async () => {
      const snap = await getDocs(collection(db, "Stores"));
      const data = snap.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() })
      ) as Store[];
      setStores(data);
    };
    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const goBackOrReplace = () => {
    if (returnTo) {
    router.replace(returnTo as any); //tạm thời bỏ qua kiểm tra kiểu
    } else {
    router.back();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: "#eee",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (showDeliveryMethod) {
              setShowDeliveryMethod(false);
            } else {
              goBackOrReplace();
            }
          }}
        >
          <Image
            source={require("@/assets/images/icon_exit.png")}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Cửa hàng</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search */}
      {!showDeliveryMethod && (
        <View style={{ paddingHorizontal: 16, marginTop: 12, marginBottom: 12 }}>
          <TextInput
            placeholder="Tìm kiếm cửa hàng..."
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

      {/* Danh sách cửa hàng */}
      {!showDeliveryMethod && (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        >
          {filteredStores.map((store) => (
            <TouchableOpacity
              key={store.id}
              onPress={() => {
                setSelectedStore(store); // ✅ lưu cả object Store
                setShowDeliveryMethod(true);
              }}
              style={{
                backgroundColor: "#f9f9f9",
                padding: 12,
                borderRadius: 12,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {store.name}
              </Text>
              <Text style={{ color: "gray", marginTop: 4 }}>{store.address}</Text>
              <Text style={{ color: "gray", marginTop: 2 }}>{store.phone}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Chọn phương thức giao hàng */}
      {showDeliveryMethod && selectedStore && (
        <DeliveryMethodSelector
          storeName={selectedStore.name}
          storeAddress={selectedStore.address}
          storePhone={selectedStore.phone}
          onEdit={() => setShowDeliveryMethod(false)}
          onConfirm={(method) => {
            setMethod(method);
            if (returnTo) {
              router.replace(returnTo as any); //
            } else {
              router.back();
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}
