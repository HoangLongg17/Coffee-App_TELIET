import { db } from "@/config/firebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  isGuest: boolean;
  userName?: string | null;
}

export default function RewardCard({ isGuest, userName }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [reward, setReward] = useState<{ totalSpent: number; drips: number }>({
    totalSpent: 0,
    drips: 0,
  });

  // ✅ Lắng nghe realtime dữ liệu reward từ Firestore
  useEffect(() => {
    if (!user || isGuest) return;
    const userRef = doc(db, "Users", user.uid);

    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setReward({
          totalSpent: snap.data().totalSpent ?? 0,
          drips: snap.data().drips ?? 0,
        });
      }
    });

    return () => unsubscribe();
  }, [user, isGuest]);

  if (isGuest) {
    return (
      <View
        style={{
          backgroundColor: "#860000ff",
          padding: 16,
          borderRadius: 12,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Chào bạn! Hãy đăng ký để tích điểm và nhận quà hấp dẫn từ Highlands Coffee
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/welcome")}
          style={{
            backgroundColor: "#fff",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#870000ff", fontWeight: "bold" }}>Đăng ký / Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Tính goal động: bắt đầu 700k, khi đạt thì nhân đôi
  const baseGoal = 700000;
  let goal = baseGoal;
  while (reward.totalSpent >= goal) {
    goal *= 2;
  }

  // ✅ Tính phần trăm tiến độ
  const progress = Math.min((reward.totalSpent / goal) * 100, 100);

  return (
    <View
      style={{
        backgroundColor: "#860000ff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      {/* Avatar + tên nếu đã đăng nhập */}
      {userName && (
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Image
            source={require("@/assets/images/icon_avatar.png")}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
          />
          <View>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>{userName}</Text>
            <Text style={{ color: "#ffd7d7", fontSize: 12 }}>THÀNH VIÊN</Text>
          </View>
        </View>
      )}

      {/* Nội dung tích điểm */}
      <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>Thẻ tích điểm</Text>
      <Text style={{ color: "#ffd7d7", marginTop: 4 }}>
        {reward.totalSpent.toLocaleString("vi-VN")} ₫ / {goal.toLocaleString("vi-VN")} ₫
      </Text>

      {/* Progress bar */}
      <View style={{ height: 8, backgroundColor: "#ffd7d7", borderRadius: 4, marginTop: 8 }}>
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: progress >= 100 ? "#00ff88" : "#fff", // xanh khi đạt mốc
            borderRadius: 4,
          }}
        />
      </View>

      {/* Chỉ hiển thị Drips */}
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <Text style={{ color: "#ffd7d7", fontSize: 12 }}>DRIPS</Text>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          {reward.drips}
        </Text>
      </View>
    </View>
  );
}
