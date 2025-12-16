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
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingCartButton() {
  const { cart } = useCart();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [scaleAnim] = useState(new Animated.Value(1));

  const triggerCartAnimation = () => {
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
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("cart:add", () => {
      triggerCartAnimation();
    });
    return () => subscription.remove();
  }, []);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          bottom: insets.bottom + 24,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
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
  wrapper: {
    position: "absolute",
    right: 24,
    zIndex: 999,
  },
  container: {
    backgroundColor: "#B22222",
    borderRadius: 32,
    padding: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: "#fff",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#B22222",
  },
});
