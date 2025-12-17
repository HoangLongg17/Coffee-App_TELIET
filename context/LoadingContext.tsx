import { useNavigationContainerRef } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingContext = createContext({
  loading: false,
  setLoading: (val: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", () => {
      // Mỗi lần state navigation thay đổi => bật loading
      setLoading(true);
      // Tắt sau 250ms (tuỳ chỉnh)
      setTimeout(() => setLoading(false), 250);
    });
    return unsubscribe;
  }, [navigationRef]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.text}>Đang tải...</Text>
        </View>
      )}
    </LoadingContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
