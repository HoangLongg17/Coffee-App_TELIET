import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (!email.trim()) {
      return; // không làm gì nếu chưa nhập email
    }
    router.push({
      pathname: "/register",
      params: { email }, // truyền email sang register
    });
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* Logo */}
      <Image
        source={require("@/assets/images/logo_TELIET.png")}
        style={{ width: 120, height: 120, marginBottom: 20 }}
      />

      {/* Tiêu đề */}
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Bắt Đầu Cuộc Hành Trình Của Bạn
      </Text>

      {/* Nhập Email */}
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{
          borderBottomWidth: 1,
          width: 250,
          fontSize: 16,
          marginBottom: 16,
        }}
      />

      {/* Nút tiếp tục */}
      <Button title="TIẾP TỤC" onPress={handleContinue} />

      {/* Hoặc */}
      <Text style={{ marginVertical: 12 }}>hoặc</Text>

      {/* Tiếp tục như khách → vào tab bar */}
      <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
        <Text style={{ fontSize: 16, color: "#d00000" }}>
          TIẾP TỤC NHƯ KHÁCH
        </Text>
      </TouchableOpacity>

      {/* Link đăng nhập */}
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ fontSize: 14, color: "#555" }}>
          Đã Có Tài Khoản?{" "}
          <Text style={{ color: "#d00000" }}>Đăng Nhập</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
