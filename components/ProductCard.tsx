import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  id: string;
  name: string;
  image?: string;
  price: number;
  onPress?: () => void;
  selected?: boolean;
}

export default function ProductCard({ name, image, price, onPress, selected }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={{ position: "relative" }}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder} />
        )}
        {selected && (
          <View style={styles.tick}>
            <Text style={{ color: "#fff", fontSize: 12 }}>✔</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {String(name ?? "")}
      </Text>
      <Text style={styles.price}>
      {typeof price === "number" ? price.toLocaleString("vi-VN") : "0"} ₫
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#B22222", // đỏ nổi bật khi chọn
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "center",
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    alignSelf: "center",
    backgroundColor: "#eee",
  },
  tick: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#2ecc71", // xanh lá
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  price: {
    color: "#ff3b30",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});
