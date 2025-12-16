import MealTimePicker from "@/components/MealTimePicker"; // ✅ import
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import React, { useState } from "react"; // ✅ thêm useState
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const { cart, removeFromCart, addToCart } = useCart();
  const router = useRouter();
  const [showTimePicker, setShowTimePicker] = useState(false); // ✅ state mở modal

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  if (cart.length === 0) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
        </View>
        <View style={styles.headerSide} />
      </View>

      {/* Nội dung giỏ hàng trống */}
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/icon_cart.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>Giỏ Hàng Của Bạn Đang Trống</Text>
        <Text style={styles.subtitle}>
          Bạn chưa thêm bất cứ sản phẩm nào vào giỏ hàng của mình.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/order")}
        >
          <Text style={styles.buttonText}>ĐẶT HÀNG NGAY</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
   );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backIcon}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
        </View>
        <View style={styles.headerSide} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {cart.map((item, index) => (
          <View key={index} style={styles.itemBox}>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>{String(item.name)}</Text>
              <Text style={styles.detail}>Size: {String(item.size)}</Text>
              <Text style={styles.detail}>Số lượng: {item.quantity}</Text>
              {item.note && (
                <Text style={styles.detail}>Ghi chú: {String(item.note)}</Text>
              )}
              <Text style={styles.detail}>
                Đơn giá: {item.unitPrice.toLocaleString("vi-VN")}₫
              </Text>
              <Text style={styles.price}>
                Thành tiền:{" "}
                {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
              </Text>
            </View>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                onPress={() => removeFromCart(item.id, item.size)}
                style={styles.qtyButton}
              >
                <Text style={{ fontSize: 18 }}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  addToCart({
                    ...item,
                    quantity: 1,
                    unitPrice: item.unitPrice,
                  })
                }
                style={styles.qtyButton}
              >
                <Text style={{ fontSize: 18 }}>＋</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>
          Tổng cộng: {getTotal().toLocaleString("vi-VN")}₫
        </Text>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => setShowTimePicker(true)} // ✅ mở modal
        >
          <Text style={styles.orderText}>TIẾN HÀNH ĐẶT HÀNG</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Modal chọn thời gian */}
      <MealTimePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onConfirm={(date) => {
          console.log("Thời gian đã chọn:", date);
          setShowTimePicker(false);
          // 👉 tại đây bạn có thể lưu vào context hoặc điều hướng sang màn hình xác nhận đơn
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerSide: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B22222",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  detail: { fontSize: 14, color: "#555", marginBottom: 2 },
  price: { fontSize: 15, color: "#B22222", fontWeight: "bold", marginTop: 4 },
  qtyControl: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  qtyButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginVertical: 4,
  },
  totalBox: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "right",
  },
  orderButton: {
    backgroundColor: "#B22222",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  orderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  icon: {
    width: 64,
    height: 64,
    tintColor: "#B22222",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#B22222",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
