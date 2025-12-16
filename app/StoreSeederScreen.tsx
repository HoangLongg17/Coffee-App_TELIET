// StoreSeederScreen.tsx
import { clearStores, seedStores } from "@/backend/storeSeeder";
import React from "react";
import { Alert, Button, ScrollView, View } from "react-native";

export default function StoreSeederScreen() {
  const handleSeed = async () => {
    try {
      await seedStores();
      Alert.alert("Thành công", "Đã seed dữ liệu 4 cửa hàng!");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể seed dữ liệu.");
    }
  };

  const handleClear = async () => {
    try {
      await clearStores();
      Alert.alert("Thành công", "Đã xóa toàn bộ dữ liệu cửa hàng!");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể xóa dữ liệu.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Button title="Seed dữ liệu cửa hàng" onPress={handleSeed} />
      </View>
      <View>
        <Button title="Xóa toàn bộ dữ liệu cửa hàng" color="red" onPress={handleClear} />
      </View>
    </ScrollView>
  );
}
