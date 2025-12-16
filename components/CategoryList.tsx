import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Category {
  name: string;
  icon: any;
}

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (name: string) => void;
  navigateOnPress?: boolean; 
}

export default function CategoryList({ categories, selected, onSelect, navigateOnPress }: Props) {
  const router = useRouter();

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 16 }}>
      {categories.map((cat) => (
        <TouchableOpacity
        key={cat.name}
        style={{ alignItems: "center" }}
        onPress={() => {
            onSelect(cat.name);
            if (navigateOnPress) {
            router.push({ pathname: "/category/[name]", params: { name: cat.name } });
            }
        }}
        >
        <Image source={cat.icon} style={{ width: 50, height: 50, marginBottom: 8 }} />
        <Text
            style={{
            fontSize: 12,
            fontWeight: selected === cat.name ? "bold" : "normal",
            color: selected === cat.name ? "blue" : "black",
            }}
        >
            {cat.name}
        </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
