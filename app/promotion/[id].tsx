// app/promotion/[id].tsx
import { db } from "@/config/firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Promotion {
  id: string;
  Title: string;
  Description?: string;
  DiscountAmount?: number | null;
  MinOrderValue?: number;
  ImageBase64?: string;
  Terms?: (string | number | object)[];
  ExpiryDate?: string;
  IsActive?: boolean;
  ApplyMethod?: "manual" | "auto";
  DiscountType?: "fixed" | "percent" | "gift";
}

export default function PromotionDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [promo, setPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
      if (id) {
        const snap = await getDoc(doc(db, "Promotions", id as string));
        if (snap.exists()) {
          setPromo({ id: snap.id, ...snap.data() } as Promotion);
        }
      }
    };
    fetchPromo();
  }, [id]);

  if (!promo) {
    return <Text style={{ padding: 16 }}>Đang tải khuyến mãi...</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Nút đóng */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={{ fontSize: 18 }}>✕</Text>
      </TouchableOpacity>

      {/* Banner */}
      {promo.ImageBase64 ? (
        <Image source={{ uri: promo.ImageBase64 }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, { backgroundColor: "#eee" }]} />
      )}

      {/* Nội dung chi tiết */}
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>{String(promo.Title ?? "")}</Text>

        {promo.Description && (
          <Text style={styles.desc}>{String(promo.Description ?? "")}</Text>
        )}

        {typeof promo.DiscountAmount === "number" && promo.DiscountType === "fixed" && (
        <Text style={styles.detail}>
          Giảm: {promo.DiscountAmount.toLocaleString("vi-VN")} ₫
        </Text>
        )}

        {typeof promo.DiscountAmount === "number" && promo.DiscountType === "percent" && (
          <Text style={styles.detail}>
            Giảm: {promo.DiscountAmount}%
          </Text>
        )}
        {typeof promo.MinOrderValue === "number" && promo.MinOrderValue > 0 && (
          <Text style={styles.detail}>
            Áp dụng cho đơn từ {promo.MinOrderValue.toLocaleString("vi-VN")} ₫
          </Text>
        )}

        {promo.ExpiryDate && (
          <Text style={styles.detail}>
            Hạn sử dụng: {String(promo.ExpiryDate ?? "")}
          </Text>
        )}

        {promo.DiscountType && (
          <Text style={styles.detail}>
            Loại khuyến mãi: {String(promo.DiscountType ?? "")}
          </Text>
        )}

        {promo.ApplyMethod && (
          <Text style={styles.detail}>
            Cách áp dụng: {promo.ApplyMethod === "manual" ? "Nhập mã" : "Tự động"}
          </Text>
        )}

        {Array.isArray(promo.Terms) && promo.Terms.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.subTitle}>Điều khoản & Điều kiện:</Text>
            {promo.Terms.map((t, i) => (
              <Text key={i} style={styles.term}>• {String(t ?? "")}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Nút áp dụng */}
      <TouchableOpacity
        style={styles.applyBtn}
        onPress={() =>
          router.push({ pathname: "/promotion/[id]/filter", params: { id: promo.id } })
        }
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Áp dụng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  closeBtn: { position: "absolute", top: 40, left: 16, zIndex: 10 },
  banner: { width: "100%", height: 200, resizeMode: "cover" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#333" },
  desc: { fontSize: 14, color: "#666", marginBottom: 12 },
  detail: { fontSize: 13, color: "#444", marginBottom: 6 },
  subTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  term: { fontSize: 12, color: "#666", marginBottom: 2 },
  applyBtn: {
    backgroundColor: "#B22222",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
  },
});
