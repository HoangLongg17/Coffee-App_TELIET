import { useLocalSearchParams, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { auth, db } from "../config/firebaseConfig";
export default function RegisterScreen() {
  const router = useRouter();
  const { email: initialEmail } = useLocalSearchParams<{ email?: string }>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    if (!fullName || !email || !password || !phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      // Đăng ký bằng Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Lưu thêm thông tin vào Firestore
      await setDoc(doc(db, "Users", user.uid), {
        fullName,
        email,
        phone,
        createdAt: new Date()
      });

      Alert.alert("Chúc mừng", "Bạn đã đăng ký thành công", [
        { text: "OK", onPress: () => router.push("/login") }
      ]);
      } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
          Alert.alert("Lỗi", "Email này đã được sử dụng. Vui lòng chọn email khác.");
        } else if (error.code === "auth/invalid-email") {
          Alert.alert("Lỗi", "Địa chỉ email không hợp lệ.");
        } else {
          Alert.alert("Lỗi", error.message || "Đăng ký thất bại");
        }
      }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Đăng ký bằng Email
      </Text>

      <TextInput
        placeholder="Họ tên"
        value={fullName}
        onChangeText={setFullName}
        style={{ borderBottomWidth: 1, marginBottom: 16 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 16 }}
      />

      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderBottomWidth: 1, marginBottom: 16 }}
      />

      <TextInput
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{ borderBottomWidth: 1, marginBottom: 16 }}
      />

      <Button title="Đăng ký" onPress={handleRegister} />
    </View>
  );
}
