import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  description?: string;
  discount?: number | null;
  discountType?: "fixed" | "percent" | "gift";
  terms?: string[];
  onPress?: () => void;
}

function formatDiscount(discount?: number | null, discountType?: Props["discountType"]) {
  if (discountType === "gift") return "Tặng quà";
  if (typeof discount !== "number") return null;

  if (discountType === "fixed") {
    return `Giảm ${discount.toLocaleString("vi-VN")}₫`;
  }
  if (discountType === "percent") {
    return `Giảm ${discount}%`;
  }

  // Fallback khi thiếu discountType:
  if (discount >= 1000) {
    return `Giảm ${discount.toLocaleString("vi-VN")}₫`;
  }
  if (discount > 0 && discount <= 100) {
    return `Giảm ${discount}%`;
  }
  return `Giảm ${discount}`;
}

export default function PromoCard({
  title,
  description,
  discount,
  discountType,
  terms,
  onPress,
}: Props) {
  const discountText = formatDiscount(discount, discountType);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.title}>{title}</Text>

      {description && <Text style={styles.desc}>{description}</Text>}

      {discountText && <Text style={styles.discount}>{discountText}</Text>}

      {Array.isArray(terms) &&
        terms.map((term, index) => (
          <Text key={index} style={styles.term}>
            • {term}
          </Text>
        ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    width: 250,
  },
  title: { fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  desc: { color: "gray", fontSize: 12, marginBottom: 4 },
  discount: { color: "red", fontSize: 12, marginBottom: 4 },
  term: { fontSize: 11, color: "gray" },
});
