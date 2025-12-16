import AccountHeader from "@/components/AccountHeader";
import MenuCard from "@/components/MenuCard";
import { auth, db } from "@/config/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [userDrips, setUserDrips] = useState(0);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "Users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      const data = snap.data();
      setUserDrips(data?.drips ?? 0);
    });
    return () => unsub();
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            await signOut(auth);
            router.replace("/welcome");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <AccountHeader
          drips={userDrips}
          onLoginPress={() => router.push("/welcome")}
        />

        {/* Tài Khoản */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tài Khoản</Text>
            <MenuCard
              icon={require("@/assets/images/icon_profile.png")}
              label="Hồ Sơ"
              onPress={() => router.push("/profile")}
            />
            <MenuCard
              icon={require("@/assets/images/icon_setting.png")}
              label="Cài Đặt"
              onPress={() => router.push("/setting")}
            />
          </View>
        )}

        {/* Thông Tin Chung */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông Tin Chung</Text>
          <MenuCard
            icon={require("@/assets/images/icon_terms.png")}
            label="Điều khoản dịch vụ"
            onPress={() => {}}
          />
          <MenuCard
            icon={require("@/assets/images/icon_privacy.png")}
            label="Chính sách bảo mật"
            onPress={() => {}}
          />
          <MenuCard
            icon={require("@/assets/images/icon_info.png")}
            label="Giới Thiệu Về Phiên Bản Ứng Dụng"
            onPress={() => {}}
          />
        </View>

        {/* Trung Tâm Trợ Giúp */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trung Tâm Trợ Giúp</Text>
          <MenuCard
            icon={require("@/assets/images/icon_help.png")}
            label="Câu Hỏi Thường Gặp"
            onPress={() => {}}
          />
          <MenuCard
            icon={require("@/assets/images/icon_support.png")}
            label="Phản Hồi & Hỗ Trợ"
            onPress={() => {}}
          />
        </View>

        {/* Đăng xuất */}
        {user && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>ĐĂNG XUẤT</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#B22222",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
