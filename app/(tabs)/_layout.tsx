import { Tabs } from "expo-router";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#B22222",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang Chủ",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/icon_home.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Đặt Hàng",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/icon_order.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Hoạt Động",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/icon_activity.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stores"
        options={{
          title: "Cửa Hàng",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/icon_store.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Khác",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("@/assets/images/icon_more.png")}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
