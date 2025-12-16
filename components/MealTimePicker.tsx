import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

function roundUpToNextQuarter(d: Date) {
  const copy = new Date(d);
  const minutes = copy.getMinutes();
  const remainder = minutes % 15;
  if (remainder !== 0) {
    copy.setMinutes(minutes + (15 - remainder), 0, 0);
  } else {
    // nếu đúng mốc, giữ nguyên giây = 0
    copy.setSeconds(0, 0);
  }
  return copy;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function MealTimePicker({ visible, onClose, onConfirm }: Props) {
  const now = useMemo(() => new Date(), [visible]); // tái tạo khi mở modal
  const start = useMemo(() => roundUpToNextQuarter(now), [now]);
  const end = useMemo(() => {
    const e = new Date(now);
    e.setHours(23, 0, 0, 0); // tối đa 23:00 cùng ngày
    return e;
  }, [now]);

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
  // reset lựa chọn khi reopen modal
  useEffect(() => {
    if (visible) {
      setSelected(start);
    }
  }, [visible, start]);

  const labelToday = "Hôm nay";
  const labelWindow = "Trong 15 phút đến 23:00";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Đặt Thời Gian Dùng Bữa Của Bạn</Text>

          {/* Ngày và Giờ chỉ là tiêu đề */}
        <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 4 }}>
            <Text style={styles.sectionLabel}>Ngày</Text>
            <Text style={styles.selectText}>{labelToday}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 4 }}>
            <Text style={styles.sectionLabel}>Giờ</Text>
        </View>
        </View>

        {/* Danh sách giờ cuộn với bước 15p */}
        <View style={styles.listWrapper}>
        <ScrollView style={{ maxHeight: 280 }}>
            {/* Mốc đầu tiên: Trong 15 phút */}
            <TouchableOpacity
            style={[styles.timeItem, selected.getTime() === start.getTime() && styles.timeItemSelected]}
            onPress={() => setSelected(start)}
            >
            <Text style={[styles.timeText, selected.getTime() === start.getTime() && styles.timeTextSelected]}>
                Trong 15 phút
            </Text>
            </TouchableOpacity>

            {timeSlots.map((slot) => {
            const hh = pad(slot.getHours());
            const mm = pad(slot.getMinutes());
            const isSelected = selected.getTime() === slot.getTime();
            return (
                <TouchableOpacity
                key={slot.getTime()}
                style={[styles.timeItem, isSelected && styles.timeItemSelected]}
                onPress={() => setSelected(slot)}
                >
                <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                    {hh}:{mm}
                </Text>
                </TouchableOpacity>
            );
            })}
        </ScrollView>
        </View>


          {/* Hiển thị giờ đã chọn lớn */}
          <Text style={styles.timeDisplay}>
            {pad(selected.getHours())}:{pad(selected.getMinutes())}
          </Text>

            <TouchableOpacity style={styles.confirmButton} onPress={() => {
                onConfirm(selected); // lưu thời gian đã chọn
                onClose();           // đóng modal
                router.push({
                pathname: "/checkout",
                params: { time: selected.toISOString() }, // truyền thời gian sang màn checkout
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
  selectBox: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  disabledBox: {
    opacity: 0.9,
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
