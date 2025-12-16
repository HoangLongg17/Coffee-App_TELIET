import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image } from "react-native";
import HomeScreen from "../app/(tabs)/home";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#B22222",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#fff", borderTopWidth: 0.5, borderTopColor: "#ddd" },
        tabBarIcon: ({ focused }) => {
          let icon;
          switch (route.name) {
            case "Trang Chủ":
              icon = require("@/assets/icons/icon_home.png");
              break;
          }
          return (
            <Image
              source={icon}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? "#B22222" : "gray",
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Trang Chủ" component={HomeScreen} />
    </Tab.Navigator>
  );
}
