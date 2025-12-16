import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { clearPromotions, seedPromotions } from "../backend/promotionService";

export default function SeedProsScreen() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seedPromotions();
      Alert.alert("Thành công", "Đã seed dữ liệu khuyến mãi lên Firebase");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể seed dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      await clearPromotions();
      Alert.alert("Thành công", "Đã xóa toàn bộ dữ liệu khuyến mãi");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể xóa dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Quản lý Promotions</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <TouchableOpacity
            onPress={handleSeed}
            style={{ backgroundColor: "#28a745", padding: 12, borderRadius: 8, marginBottom: 12 }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Seed dữ liệu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClear}
            style={{ backgroundColor: "#dc3545", padding: 12, borderRadius: 8 }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Xóa dữ liệu</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}