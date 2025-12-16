import { db } from "@/config/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  drips?: number;
  prepaid?: number;
  onLoginPress?: () => void;
  onActivate?: () => void;
}

export default function AccountHeader({
  drips = 0,
  prepaid = 0,
  onLoginPress,
  onActivate,
}: Props) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "Users", user.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setFullName(snap.data().fullName);
      }
    });
    return () => unsub();
  }, [user]);

  return (
    <View style={styles.wrapper}>
      {!user ? (
        <>
          <View style={styles.row}>
            <Image
              source={require("@/assets/images/icon_avatar.png")}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
              <Text style={styles.subtitle}>Và Nhận Ngay Quà Tặng Hấp Dẫn</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onLoginPress} style={styles.loginButton}>
            <Text style={styles.loginText}>ĐĂNG KÝ / ĐĂNG NHẬP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.row}>
            <Image
              source={require("@/assets/images/icon_avatar.png")}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>
                {fullName ?? "Người dùng"} |{" "}
                <Text style={styles.member}>THÀNH VIÊN</Text>
              </Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>DRIPS: {drips}</Text>
            <Text style={styles.statusText}>
              Trả Trước: {prepaid.toLocaleString("vi-VN")} ₫
            </Text>
            <TouchableOpacity
              style={styles.activateButton}
              onPress={onActivate}
            >
              <Text style={styles.activateText}>KÍCH HOẠT</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    backgroundColor: "#B22222",
    position: "relative",
    marginBottom: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#f0f0f0",
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  loginText: {
    color: "#B22222",
    fontWeight: "bold",
    fontSize: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  member: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFD700",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#fff",
  },
  activateButton: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  activateText: {
    color: "#B22222",
    fontSize: 13,
    fontWeight: "bold",
  },
});
