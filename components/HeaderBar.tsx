import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  userName: string | null;
  onSearchToggle: () => void;
}

export default function HeaderBar({ userName, onSearchToggle }: Props) {
  const router = useRouter();

  const handleAvatarPress = () => {
    if (userName) {
      // ✅ đã đăng nhập
      router.push("/more");
    } else {
      // ✅ khách
      router.push("/welcome");
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Avatar + tên */}
        <TouchableOpacity style={styles.avatarBox} onPress={handleAvatarPress}>
          <Image
            source={require("@/assets/images/icon_avatar.png")}
            style={styles.avatar}
          />
          {userName && <Text style={styles.userName}>{userName}</Text>}
        </TouchableOpacity>

        {/* Icon search */}
        <TouchableOpacity onPress={onSearchToggle}>
          <Image
            source={require("@/assets/images/icon_search.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    elevation: 4, // cho Android
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  avatarBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
});
