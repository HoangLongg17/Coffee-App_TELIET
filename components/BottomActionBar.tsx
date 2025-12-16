import CartButtonInline from "@/components/CartButtonInline";
import { useStore } from "@/context/StoreContext";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface BottomActionBarProps {
  hasTabBar?: boolean; // ✅ thêm prop để phân biệt màn có tab bar hay không
}

export default function BottomActionBar({ hasTabBar = false }: BottomActionBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedStore } = useStore();
  return (
    <View
      style={[
        styles.bar,
        hasTabBar
          ? { bottom: 0 } // có tab bar thì dính sát
          : { bottom: insets.bottom || 12 } // không có tab bar thì cách an toàn
      ]}
    >
      <TouchableOpacity
        style={styles.location}
        onPress={() =>
        router.push({
            pathname: "/stores",
            params: { returnTo: "/order" }, // ✅ truyền màn hình muốn quay lại
        })
        }
      >
        <Image
          source={require("@/assets/images/icon_location.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>
        {selectedStore ? selectedStore.name : "Chọn Một Địa Chỉ"}
        </Text>
      </TouchableOpacity>
      <CartButtonInline />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#B22222",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    zIndex: 999,
    elevation: 6,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
