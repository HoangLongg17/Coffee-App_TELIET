import { useDelivery } from "@/context/DeliveryContext";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  onEdit: () => void;
  onConfirm: (method: "Tại quán" | "Mang về") => void;
}

export default function DeliveryMethodSelector({
  storeName,
  storeAddress,
  storePhone,
  onEdit,
  onConfirm,
}: Props) {
  const { method, setMethod } = useDelivery();
  const [selected, setSelected] = useState<"Tại quán" | "Mang về">(method || "Tại quán");

  useEffect(() => {
    if (method) setSelected(method);
  }, [method]);

  const handleSelect = (value: "Tại quán" | "Mang về") => {
    setSelected(value);
    setMethod(value); // lưu vào context + AsyncStorage
    onConfirm(value); // báo ngược về stores.tsx để điều hướng
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn phương thức giao hàng</Text>

      <View style={styles.methodRow}>
        {["Tại quán", "Mang về"].map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => handleSelect(label as "Tại quán" | "Mang về")}
            style={[
              styles.methodButton,
              selected === label && styles.methodSelected,
            ]}
          >
            <Text
              style={[
                styles.methodText,
                selected === label && styles.methodTextSelected,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{storeName}</Text>
        <Text style={styles.storeDetail}>{storeAddress}</Text>
        <Text style={styles.storeDetail}>{storePhone}</Text>
      </View>

      <TouchableOpacity onPress={onEdit}>
        <Text style={styles.editText}>Thay Đổi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  methodSelected: {
    borderColor: "#B22222",
    backgroundColor: "#ffecec",
  },
  methodText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
  methodTextSelected: {
    color: "#B22222",
  },
  storeInfo: {
    marginBottom: 12,
  },
  storeName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  storeDetail: {
    fontSize: 13,
    color: "#666",
  },
  editText: {
    color: "#B22222",
    fontWeight: "bold",
    fontSize: 14,
    textDecorationLine: "underline", // gạch chân cho giống "Thay Đổi"
  },
});
