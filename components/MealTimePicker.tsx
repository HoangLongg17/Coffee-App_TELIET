import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function MealTimePicker({ visible, onClose, onConfirm }: Props) {
  const now = useMemo(() => new Date(), [visible]);

  // Mốc đầu tiên: trong 15 phút
  const start = useMemo(() => {
    const d = new Date(now.getTime() + 15 * 60000);
    d.setSeconds(0, 0);
    return d;
  }, [now]);

  // Giới hạn cuối cùng trong ngày: 23:00
  const end = useMemo(() => {
    const e = new Date(now);
    e.setHours(23, 0, 0, 0);
    return e;
  }, [now]);

  // Các mốc: từ start, mỗi bước 15 phút
  const timeSlots = useMemo(() => {
    const slots: Date[] = [];
    let cur = new Date(start);
    while (cur <= end) {
      slots.push(new Date(cur));
      cur.setMinutes(cur.getMinutes() + 15);
    }
    return slots;
  }, [start, end]);

  const [selected, setSelected] = useState<Date>(start);
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      setSelected(start);
    }
  }, [visible, start]);

  const labelToday = "Hôm nay";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Nút đóng */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Đặt Thời Gian Dùng Bữa Của Bạn</Text>

          {/* Ngày và Giờ */}
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text style={styles.sectionLabel}>Ngày</Text>
              <Text style={styles.selectText}>{labelToday}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Text style={styles.sectionLabel}>Giờ</Text>
            </View>
          </View>

          {/* Danh sách giờ */}
          <View style={styles.listWrapper}>
            <ScrollView style={{ maxHeight: 280 }}>
              {timeSlots.map((slot, index) => {
                const hh = pad(slot.getHours());
                const mm = pad(slot.getMinutes());
                const isSelected = selected.getTime() === slot.getTime();
                const label = index === 0 ? "Trong 15 phút" : `${hh}:${mm}`;
                return (
                  <TouchableOpacity
                    key={slot.getTime()}
                    style={[styles.timeItem, isSelected && styles.timeItemSelected]}
                    onPress={() => setSelected(slot)}
                  >
                    <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Hiển thị giờ đã chọn */}
          <Text style={styles.timeDisplay}>
            {pad(selected.getHours())}:{pad(selected.getMinutes())}
          </Text>

          {/* Nút xác nhận */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              onConfirm(selected);
              onClose();
              router.push({
                pathname: "/checkout",
                params: { time: selected.toISOString() },
              });
            }}
          >
            <Text style={styles.confirmText}>ĐẶT THỜI GIAN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#B22222",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  selectText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  listWrapper: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  timeItem: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 4,
    backgroundColor: "#f9f9f9",
  },
  timeItemSelected: {
    backgroundColor: "#ffecec",
    borderWidth: 1,
    borderColor: "#B22222",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  timeTextSelected: {
    color: "#B22222",
  },
  timeDisplay: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B22222",
    textAlign: "center",
    marginVertical: 8,
  },
  confirmButton: {
    backgroundColor: "#B22222",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
    marginLeft: 4,
  },
});
