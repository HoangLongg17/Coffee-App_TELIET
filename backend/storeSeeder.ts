// storeSeeder.ts
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export async function seedStores() {
  const stores = [
    {
      name: "TELIET Coffee Nguyễn Huệ",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "0123456789",
      isActive: true,
    },
    {
      name: "TELIET Coffee Landmark 81",
      address: "Tầng trệt Landmark 81, Bình Thạnh, TP.HCM",
      phone: "0987654321",
      isActive: true,
    },
    {
      name: "TELIET Coffee Hà Nội Tower",
      address: "49 Hai Bà Trưng, Hoàn Kiếm, Hà Nội",
      phone: "0241234567",
      isActive: true,
    },
    {
      name: "TELIET Coffee Đà Nẵng",
      address: "36 Bạch Đằng, Hải Châu, Đà Nẵng",
      phone: "0511388888",
      isActive: true,
    },
  ];

  for (const store of stores) {
    await addDoc(collection(db, "Stores"), store);
    console.log(`Seeded: ${store.name}`);
  }
}

export async function clearStores() {
  const snap = await getDocs(collection(db, "Stores"));
  for (const d of snap.docs) {
    await deleteDoc(doc(db, "Stores", d.id));
  }
}
