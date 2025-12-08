import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Trong Expo Go dev, chỉ cần để trống hoặc dùng webClientId chung
    webClientId: "",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Access Token:", authentication?.accessToken);
      // TODO: gọi Google API để lấy thông tin profile
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Đăng Ký Tài Khoản
      </Text>
      <Button
        disabled={!request}
        title="Đăng ký bằng Google"
        onPress={() => promptAsync()}
      />
    </View>
  );
}
