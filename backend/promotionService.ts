import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export async function seedPromotions() {
  const promos = [
    {
      Title: "Giảm 30K cho hóa đơn từ 129K",
      Description: "Vào App hôm nay, giảm 30K cho hóa đơn từ 129K. Nước ngon đang chờ bạn nha!",
      DiscountAmount: 30000,
      MinOrderValue: 129000,
      ImageBase64: "",
      Terms: [
        "Áp dụng đến hết 30/12.",
        "Giảm 30K cho tổng hóa đơn từ 129K.",
        "Chỉ áp dụng cho giao dịch được đặt thông qua ứng dụng.",
        "Không áp dụng đồng thời với các chương trình khuyến mãi khác."
      ],
      ExpiryDate: "2025-09-30",
      IsActive: true,
      ApplyMethod: "manual",
      DiscountType: "fixed"
    },
    {
      Title: "Giảm 50K cho đơn từ 200K",
      Description: "Khuyến mãi đặc biệt cuối tuần, giảm ngay 50K cho đơn từ 200K.",
      DiscountAmount: 50000,
      MinOrderValue: 200000,
      ImageBase64: "",
      Terms: [
        "Chỉ áp dụng cho giao dịch được đặt thông qua ứng dụng.",
        "Không áp dụng đồng thời với các chương trình khuyến mãi khác."
      ],
      ExpiryDate: "2025-12-31",
      IsActive: true,
      ApplyMethod: "manual",
      DiscountType: "fixed"
    },
    {
      Title: "Miễn phí giao hàng nội thành",
      Description: "Đơn từ 80K sẽ được miễn phí giao hàng trong khu vực nội thành.",
      DiscountAmount: 0,
      MinOrderValue: 80000,
      ImageBase64: "",
      Terms: [
        "Chỉ áp dụng cho giao dịch được đặt thông qua ứng dụng.",
        "Không áp dụng đồng thời với các chương trình khuyến mãi khác."
      ],
      ExpiryDate: "2025-12-15",
      IsActive: true,
      ApplyMethod: "manual",
      DiscountType: "fixed"
    },
    {
      Title: "Giảm 20% cho sản phẩm Freeze",
      Description: "Tất cả sản phẩm Freeze được giảm 20% trong tuần này.",
      DiscountAmount: 20,
      ImageBase64: "",
      Terms: [
        "Chỉ áp dụng cho giao dịch được đặt thông qua ứng dụng.",
        "Không áp dụng đồng thời với các chương trình khuyến mãi khác."
      ],
      ExpiryDate: "2025-12-20",
      IsActive: true,
      ApplyMethod: "manual",
      DiscountType: "percent"
    },
    {
    Title: "Tặng 1 ly khi mua 3",
    Description: "Mua 3 ly bất kỳ, tặng ngay Freeze-socola hoặc Cappuccino!.",
    DiscountAmount: null,
    MinQuantity: 3,
    GiftQuantity: 1,
    GiftProductIds: ["4QpjDKAbCoPQnePkuiH8", "7Ee0xP1w7NdDKGsgRt2y"],
    ImageBase64: "",
    Terms: [
      "Chỉ áp dụng cho giao dịch được đặt thông qua ứng dụng.",
      "Không áp dụng đồng thời với các chương trình khuyến mãi khác."
    ],
    ExpiryDate: "2025-12-25",
    IsActive: true,
    ApplyMethod: "manual",
    DiscountType: "gift"
  }
  ];

  for (const promo of promos) {
    await addDoc(collection(db, "Promotions"), promo);
    console.log(`Seeded: ${promo.Title}`);
  }
}

export async function clearPromotions() {
  const snap = await getDocs(collection(db, "Promotions"));
  for (const d of snap.docs) {
    await deleteDoc(doc(db, "Promotions", d.id));
  }
}