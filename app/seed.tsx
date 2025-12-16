import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { clearProducts, seedProductsOnce } from "../backend/productService"; // đường dẫn tới file seed của bạn
export default function SeedScreen() {
  const handleSeed = async () => {
    try {
      await seedProductsOnce();
      Alert.alert("Thông báo", "Seed dữ liệu sản phẩm thành công!");
    } catch (e) {
      console.error(e);
      Alert.alert("Lỗi", "Có lỗi khi seed dữ liệu.");
    }
  };

  const handleClear = async () => {
    try {
      await clearProducts();
      Alert.alert("Thông báo", "Đã xóa toàn bộ dữ liệu trong Products!");
    } catch (e) {
      console.error(e);
      Alert.alert("Lỗi", "Có lỗi khi xóa dữ liệu.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SeedScreen</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#28a745" }]} onPress={handleSeed}>
        <Text style={styles.buttonText}>Seed dữ liệu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#dc3545" }]} onPress={handleClear}>
        <Text style={styles.buttonText}>Xóa dữ liệu</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
