import { db } from "@/config/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { collection, doc, getDocs, increment, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface Order {
  id: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number; // tổng sau khuyến mãi
  totalBeforeDiscount?: number; // ✅ thêm trường tổng trước khuyến mãi
  status: "Đang chờ" | "Đã hủy" | "Đã nhận hàng";
}

export default function ActivityScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "drips">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [userDrips, setUserDrips] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const userName = user?.displayName ?? null;

  // ✅ Lấy đơn hàng từ Firestore theo userId
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const q = query(collection(db, "Orders"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const data: Order[] = snap.docs.map(d => ({
        id: d.id,
        items: d.data().items ?? [],
        total: d.data().total ?? 0,
        totalBeforeDiscount: d.data().totalBeforeDiscount ?? d.data().total ?? 0,
        status: d.data().status ?? "Đang chờ",
      }));
      setOrders(data);
    };
    fetchOrders();
  }, [user]);
  useEffect(() => { 
    if (!user) return; 
    const userRef = doc(db, "Users", user.uid); 
    const unsub = onSnapshot(userRef, (snap) => { const data = snap.data(); 
      setUserDrips(data?.drips ?? 0); setTotalSpent(data?.totalSpent ?? 0); 
    }); 
    return () => unsub(); 
    }, 
    [user]);
  const handleCancel = async (id: string) => {
    await updateDoc(doc(db, "Orders", id), { status: "Đã hủy" });
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: "Đã hủy" } : o)));
  };

  const handleConfirm = async (id: string, totalBeforeDiscount: number) => {
    // ✅ cập nhật trạng thái đơn hàng
    await updateDoc(doc(db, "Orders", id), { status: "Đã nhận hàng" });

    // ✅ tính điểm Drips
    const drips = Math.floor(totalBeforeDiscount / 10000);

    // ✅ cộng dồn vào hồ sơ user
    if (user) {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        totalSpent: increment(totalBeforeDiscount),
        drips: increment(drips),
      });
    }

    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status: "Đã nhận hàng" } : o)));
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {!user ? (
        <View style={styles.centerBox}>
          <Text style={styles.title}>Đơn Hàng & Hoạt Động</Text>
          <Text style={styles.subtitle}>Theo Dõi Đơn Hàng Và Lịch Sử DRIP Của Bạn</Text>
          <TouchableOpacity onPress={() => router.push("/welcome")} style={styles.button}>
            <Text style={styles.buttonText}>ĐĂNG KÝ / ĐĂNG NHẬP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Đơn Hàng & Hoạt Động</Text>

          {/* Tabs */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              onPress={() => setActiveTab("orders")}
              style={[styles.tabButton, activeTab === "orders" && styles.tabActive]}
            >
              <Text style={activeTab === "orders" ? styles.tabTextActive : styles.tabText}>
                Đơn Đặt Hàng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("drips")}
              style={[styles.tabButton, activeTab === "drips" && styles.tabActive]}
            >
              <Text style={activeTab === "drips" ? styles.tabTextActive : styles.tabText}>
                Điểm Drips
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nội dung tab */}
          <View style={styles.contentBox}>
            {activeTab === "orders" ? (
              orders.length === 0 ? (
                <Text style={styles.emptyText}>Không có đơn hàng.</Text>
              ) : (
                orders.map(order => (
                  <View key={order.id} style={styles.orderBox}>
                    <Text style={styles.orderTitle}>Đơn hàng {order.id}</Text>
                    {order.items.map((item, idx) => (
                      <Text key={idx}>
                        {item.qty}x {item.name} (Size {item.size}) - {(item.price * item.qty).toLocaleString("vi-VN")} ₫
                      </Text>
                    ))}
                    <Text style={styles.totalText}>Tổng: {order.total.toLocaleString("vi-VN")} ₫</Text>
                    <Text>Trạng thái: {order.status}</Text>

                    {order.status === "Đang chờ" && (
                      <View style={styles.actions}>
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: "#B22222" }]}
                          onPress={() => handleCancel(order.id)}
                        >
                          <Text style={styles.actionText}>Hủy đơn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionBtn, { backgroundColor: "#228B22" }]}
                          onPress={() => handleConfirm(order.id, order.totalBeforeDiscount ?? order.total)}
                        >
                          <Text style={styles.actionText}>Đã nhận hàng</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )
            ) : (
             <View style={styles.dripsBox}>
            <Text style={styles.dripsTitle}>Điểm Drips hiện tại</Text>
            <Text style={styles.dripsValue}>{userDrips}</Text>
            <Text style={styles.dripsNote}>
              Tổng chi trước khuyến mãi: {totalSpent.toLocaleString("vi-VN")} ₫
            </Text>
            </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, padding: 20 },
  centerBox: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "#B22222", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  tabRow: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 2, borderColor: "transparent" },
  tabActive: { borderColor: "#B22222" },
  tabText: { fontSize: 16, color: "#888" },
  tabTextActive: { fontSize: 16, fontWeight: "bold", color: "#B22222" },
  contentBox: { flex: 1 },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 20 },
  orderBox: { padding: 16, borderWidth: 1, borderColor: "#eee", borderRadius: 8, marginBottom: 12 },
  orderTitle: { fontSize: 15, fontWeight: "bold", marginBottom: 4 },
  totalText: { fontSize: 14, fontWeight: "bold", marginTop: 6 },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 12 },
  actionBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  actionText: { color: "#fff", fontWeight: "bold" },
  dripsBox: {
  padding: 20,
  borderWidth: 1,
  borderColor: "#eee",
  borderRadius: 8,
  alignItems: "center",
  marginTop: 12,
  },
  dripsTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  dripsValue: { fontSize: 28, fontWeight: "bold", color: "#B22222", marginBottom: 6 },
  dripsNote: { fontSize: 14, color: "#666" },
});
