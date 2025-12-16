// app/settings.tsx
import { auth } from "@/config/firebaseConfig";
import { useRouter } from "expo-router";
import { deleteUser } from "firebase/auth";
import React from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa tài khoản?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                await deleteUser(user); // ✅ xóa tài khoản trên Firebase
                Alert.alert("Thông báo", "Tài khoản đã được xóa.");
                router.replace("/welcome"); // quay về trang welcome
              } else {
                Alert.alert("Lỗi", "Không tìm thấy người dùng.");
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Lỗi", "Không thể xóa tài khoản, vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    // ✅ điều hướng sang màn hình đổi mật khẩu
    router.push("/changePassword");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài Đặt</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Nội dung */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài Đặt Tài Khoản</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
          <Image
            source={require("@/assets/images/icon_profile.png")}
            style={styles.icon}
          />
          <Text style={[styles.menuLabel, { color: "red" }]}>Xóa Tài Khoản</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bảo Mật</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <Image
            source={require("@/assets/images/icon_lock.png")}
            style={styles.icon}
          />
          <Text style={styles.menuLabel}>Tạo mật khẩu</Text>
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
  },
  closeBtn: { fontSize: 20, fontWeight: "bold", color: "#B22222" },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  section: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 12 },
  menuItem: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  icon: { width: 24, height: 24, marginRight: 12, tintColor: "#B22222" },
  menuLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
});
