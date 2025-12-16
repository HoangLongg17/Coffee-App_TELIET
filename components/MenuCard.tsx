// components/MenuCard.tsx
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

interface Props {
  icon: any;
  label: string;
  onPress?: () => void;
}

export default function MenuCard({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  label: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
});
