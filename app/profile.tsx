// app/profile.tsx
import { db } from "@/config/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // ✅ state cho thông tin
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [drips, setDrips] = useState(0);

  // ✅ load dữ liệu từ Firestore khi mở màn hình
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "Users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName ?? "");
          setPhone(data.phone ?? "");
          setDrips(data.drips ?? 0);
        } else {
          // ✅ nếu chưa có document trong Firestore, lấy từ Firebase Auth
          if (user.displayName) {
            setFullName(user.displayName);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert("Lỗi", "Bạn cần đăng nhập để cập nhật hồ sơ.");
      return;
    }

    try {
      // ✅ cập nhật Firestore
      await setDoc(
        doc(db, "Users", user.uid),
        {
          fullName,
          phone,
          email: user.email,
          drips,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // ✅ cập nhật Firebase Auth profile (displayName)
      await updateProfile(user, {
        displayName: fullName,
      });

      Alert.alert("Thành công", "Thông tin hồ sơ đã được cập nhật.");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ, vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Hồ Sơ</Text>
        <Text style={styles.headerSub}>DRIPS: {drips}</Text>
        <Text style={styles.headerSub}>Thành viên</Text>
        <Text style={styles.headerSub}>Trả Trước: 0 ₫</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Họ tên</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ tên"
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Nhập số điện thoại"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#f5f5f5", color: "#666" }]}
          value={user?.email ?? ""}
          editable={false} // ✅ chỉ xem, không sửa
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>LƯU THÔNG TIN</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  headerBox: {
    backgroundColor: "#B22222",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  headerSub: { fontSize: 14, color: "#fff", marginBottom: 4 },
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
