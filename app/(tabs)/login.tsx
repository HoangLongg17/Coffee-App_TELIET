import React, { useEffect, useState } from "react";
import { View, Button, ActivityIndicator } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Access Token:", authentication?.accessToken);
      setLoading(false);
      // TODO: điều hướng sang màn hình Menu sau khi đăng nhập thành công
    } else if (response?.type === "error" || response?.type === "dismiss") {
      setLoading(false);
    }
  }, [response]);

  const handleLogin = async () => {
    if (!request || loading) return;
    setLoading(true);
    await promptAsync();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button
          disabled={!request}
          title="Đăng nhập bằng Google"
          onPress={handleLogin}
        />
      )}
    </View>
  );
}
