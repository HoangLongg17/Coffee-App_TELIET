import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Animated,
    DeviceEventEmitter,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CartButtonInline() {
  const { cart } = useCart();
  const router = useRouter();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("cart:add", () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
    return () => subscription.remove();
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.push("/cart")}
      >
        <Image
          source={require("@/assets/images/icon_cart.png")}
          style={styles.icon}
        />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 10,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#B22222",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#B22222",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
});
