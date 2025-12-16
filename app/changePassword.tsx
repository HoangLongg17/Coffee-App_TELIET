// app/changePassword.tsx
import { auth } from "@/config/firebaseConfig"; // ✅ import auth từ config
import { useRouter } from "expo-router";
import { updatePassword } from "firebase/auth";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ mật khẩu mới và xác nhận.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Thông báo", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Lỗi", "Bạn cần đăng nhập để đổi mật khẩu.");
        return;
      }

      await updatePassword(user, newPassword); // ✅ gọi Firebase updatePassword
      Alert.alert("Thành công", "Mật khẩu đã được thay đổi.");
      router.back();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể đổi mật khẩu. Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo mật khẩu mới</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Form nhập mật khẩu */}
      <View style={styles.form}>
        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Nhập mật khẩu mới"
        />

        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Nhập lại mật khẩu mới"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>LƯU MẬT KHẨU</Text>
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
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#B22222",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
