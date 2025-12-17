// app/checkout.tsx
import { db } from "@/config/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useDelivery } from "@/context/DeliveryContext";
import { useStore } from "@/context/StoreContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function CheckoutScreen() {
  const { cart, clearCart, appliedPromotion } = useCart();
  const { selectedStore } = useStore();
  const { method } = useDelivery();
  const { user } = useAuth();
  const { time } = useLocalSearchParams();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"Tại quầy">("Tại quầy");
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discount =
  appliedPromotion?.DiscountType === "fixed"
    ? appliedPromotion.DiscountAmount ?? 0
    : appliedPromotion?.DiscountType === "percent"
    ? Math.floor(totalPrice * ((appliedPromotion.DiscountAmount ?? 0) / 100))
    : 0;

  const finalPrice = Math.max(totalPrice - discount, 0);

  const handleClearCart = () => {
    Alert.alert(
      "Xác Nhận",
      "Bạn có muốn xóa tất cả các mục trong giỏ hàng và hủy giao dịch?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            clearCart();
            router.replace("/order"); // ✅ quay về màn hình order
          },
        },
      ]
    );
  };
  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để đặt hàng");
      return;
    }

    try {
      // ✅ tạo document mới trong Firestore
      const orderRef = await addDoc(collection(db, "Orders"), {
        userId: user.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          size: item.size,
          qty: item.quantity,
          price: item.unitPrice,
        })),
        store: selectedStore ?? null,
        method,
        time: time ?? null,
        promotion: appliedPromotion ?? null,
        totalBeforeDiscount: totalPrice, //tổng trước khuyến mãi
        total: finalPrice,
        status: "Đang chờ",
        paymentMethod: "Tại quầy",
        createdAt: serverTimestamp(),
      });

      clearCart(); //clear giỏ sau khi đặt

      //chuyển sang activity, truyền id đơn hàng
      router.replace({
        pathname: "/activity",
        params: { orderId: orderRef.id },
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng, vui lòng thử lại");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        {/* Nút X bên trái */}
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>

        {/* Bên phải: giữ độ rộng cố định để cân đối */}
        <View style={{ minWidth: 80, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearButton}>Xóa giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cửa hàng */}
        <View style={styles.section}>
          <View style={styles.storeHeader}>
            <Text style={styles.sectionTitle}>Cửa hàng</Text>
            {selectedStore && (
              <TouchableOpacity
                onPress={() =>
                  router.push({ pathname: "/stores", params: { returnTo: "/checkout" } })
                }
              >
                <Text style={styles.changeLink}>Thay đổi</Text>
              </TouchableOpacity>
            )}
          </View>
          {selectedStore ? (
            <>
              {method === "Tại quán" && (
                <Text style={styles.dineInLabel}>Dùng bữa tại</Text>
              )}
              {method === "Mang về" && (
                <Text style={styles.dineInLabel}>Mang về</Text>
              )}
              <Text style={styles.sectionText}>{selectedStore.name}</Text>
              <Text style={styles.sectionSub}>{selectedStore.address}</Text>
              <Text style={styles.sectionSub}>{selectedStore.phone}</Text>
            </>
          ) : (
            <Text style={styles.sectionText}>Chưa chọn cửa hàng</Text>
          )}
        </View>

        {/* Phương thức giao hàng */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức giao hàng</Text>
          <Text style={styles.sectionText}>{method ?? "Chưa chọn"}</Text>
        </View>

        {/* Thời gian */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thời gian</Text>
          <Text style={styles.sectionText}>
            {time
              ? new Date(time as string).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Chưa chọn"}
          </Text>
        </View>

        {/* Giỏ hàng */}
        <View style={styles.section}>
          <View style={styles.storeHeader}>
            <Text style={styles.sectionTitle}>Giỏ hàng</Text>
            <TouchableOpacity onPress={() => router.push("/order")}>
              <Text style={styles.changeLink}>Thêm sản phẩm</Text>
            </TouchableOpacity>
          </View>
          {cart.map((item) => (
            <View key={`${item.id}-${item.size}`} style={styles.cartItem}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.cartImage} />
              ) : (
                <View style={styles.cartImagePlaceholder} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.cartName}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.cartSub}>Size: {item.size}</Text>
              </View>
              <Text style={styles.cartPrice}>
                {(item.unitPrice * item.quantity).toLocaleString("vi-VN")} ₫
              </Text>
            </View>
          ))}
        </View>

        {/* Tổng tiền */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tạm tính</Text>
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString("vi-VN")} ₫
          </Text>
        </View>

        {/* Khuyến mãi */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Khuyến mãi</Text>
        {appliedPromotion ? (
            <>
            <Text style={styles.sectionText}>{appliedPromotion.Title}</Text>
            {appliedPromotion.DiscountType === "fixed" && appliedPromotion.DiscountAmount && (
                <Text style={styles.sectionSub}>
                Giảm {appliedPromotion.DiscountAmount.toLocaleString("vi-VN")} ₫
                </Text>
            )}
            {appliedPromotion.DiscountType === "percent" && (
                <Text style={styles.sectionSub}>Giảm {appliedPromotion.DiscountAmount ?? 0}%</Text>
            )}
            {appliedPromotion.DiscountType === "gift" && (
                <Text style={styles.sectionSub}>Khuyến mãi tặng kèm sản phẩm</Text>
            )}
            </>
        ) : (
            <Text style={styles.sectionSub}>Chưa áp dụng khuyến mãi</Text>
        )}
        </View>
        {/* Thanh toán */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Text style={[styles.sectionText, { color: "#B22222" }]}>
              Tại quầy
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
          <Text style={styles.orderText}>
            ĐẶT HÀNG ({finalPrice.toLocaleString("vi-VN")} ₫)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  closeButton: { fontSize: 20, fontWeight: "bold", color: "#B22222" },
  clearButton: {
    fontSize: 14,
    color: "#B22222",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  sectionText: { fontSize: 14, fontWeight: "600", color: "#333" },
  sectionSub: { fontSize: 13, color: "#666" },
  storeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  changeLink: {
    fontSize: 13,
    color: "#B22222",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  dineInLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#B22222",
    marginBottom: 4,
  },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  cartImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  cartImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  cartName: { fontSize: 14, fontWeight: "bold" },
  cartSub: { fontSize: 12, color: "#666" },
  cartPrice: { fontSize: 14, fontWeight: "600", color: "#B22222" },
  totalPrice: { fontSize: 16, fontWeight: "bold", color: "#B22222" },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  orderButton: {
    backgroundColor: "#B22222",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  orderText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
