import { useAuth } from "@/context/AuthContext"; // import context
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth } from "../config/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user } = useAuth(); // lấy trạng thái user từ context

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      // Đăng nhập bằng Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lúc này AuthContext sẽ tự động cập nhật user nhờ onAuthStateChanged
      Alert.alert("Chúc mừng", `Đăng nhập thành công với email: ${user.email}`, [
        {
          text: "OK",
          onPress: () => router.push("/home"),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đăng nhập thất bại");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      {/* Logo */}
      <Image
        source={require("@/assets/images/logo_TELIET.png")}
        style={{ width: 120, height: 120, marginBottom: 20 }}
        resizeMode="contain"
      />

      {/* Tiêu đề */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Đăng nhập
      </Text>

      {/* Ô nhập email */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          width: "100%",
          marginBottom: 16,
        }}
      />

      {/* Ô nhập mật khẩu */}
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          width: "100%",
          marginBottom: 16,
        }}
      />

      {/* Nút đăng nhập */}
      <Button title="Đăng nhập" onPress={handleLogin} />

      {/* Link đăng ký */}
      <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 14, color: "#555" }}>
          Chưa có tài khoản? <Text style={{ color: "#d00000" }}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
