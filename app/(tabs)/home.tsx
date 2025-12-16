import FloatingCartButton from "@/components/FloatingCartButton";
import { useAuth } from "@/context/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BannerSwiper from "../../components/BannerSwiper";
import CategoryList from "../../components/CategoryList";
import HeaderBar from "../../components/HeaderBar";
import ProductCard from "../../components/ProductCard";
import PromoCard from "../../components/PromoCard";
import RewardCard from "../../components/RewardCard";
import { db } from "../../config/firebaseConfig";

interface Product {
  id: string;
  Name: string;
  Description?: string;
  ImageBase64?: string;
  Category?: string;
  IsBestSeller?: boolean;
  Sizes?: { S?: number; M?: number; L?: number };
}

interface Promotion {
  id: string;
  Title: string;
  Description?: string;
  DiscountAmount?: number | null;
  MinOrderValue?: number;
  Terms?: string[];
  ExpiryDate?: string;
  IsActive?: boolean;
  ApplyMethod?: "manual" | "auto";
  DiscountType?: "fixed" | "percent" | "gift";
}

const getDisplayPrice = (p: Product) => {
  if (p.Sizes) {
    if (p.Sizes.M !== undefined) return p.Sizes.M;
    if (p.Sizes.S !== undefined) return p.Sizes.S;
    if (p.Sizes.L !== undefined) return p.Sizes.L;
  }
  return 0;
};

const bannerImages = [
  require("@/assets/images/banner1.png"),
  require("@/assets/images/banner2.png"),
  require("@/assets/images/banner3.png"),
];

const categories = [
  { name: "TRÀ SỮA", icon: require("@/assets/images/icon_TraSua.png") },
  { name: "FREEZE", icon: require("@/assets/images/icon_freeze.png") },
  { name: "CÀ PHÊ", icon: require("@/assets/images/icon_coffee.png") },
  { name: "TRÀ", icon: require("@/assets/images/icon_tea.png") },
];

export default function HomeScreen() {
  const { guest } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      Alert.alert(
        "Thông Báo",
        "Chào mừng bạn. Bạn hiện đang sử dụng ứng dụng với tư cách là khách. Để đặt hàng vui lòng đăng nhập hoặc đăng ký."
      );
    }

    // ✅ Lắng nghe realtime thông tin user
    let unsub: (() => void) | undefined;
    if (user) {
      const userRef = doc(db, "Users", user.uid);
      unsub = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setUserName(snap.data().fullName ?? null);
        }
      });
    }

    // ✅ Lấy dữ liệu sản phẩm và khuyến mãi
    const fetchData = async () => {
      try {
        const productsSnap = await getDocs(collection(db, "Products"));
        const productsData = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
        setProducts(productsData);

        const promosSnap = await getDocs(collection(db, "Promotions"));
        const promosData = promosSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Promotion[];
        setPromotions(promosData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      if (unsub) unsub();
    };
  }, [user, guest]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <HeaderBar
        userName={userName}
        onSearchToggle={() => setShowSearch(!showSearch)}
      />

      {/* Nội dung */}
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          {/* Tìm kiếm */}
          {showSearch && (
            <TextInput
              placeholder="Tìm sản phẩm..."
              value={searchText}
              onChangeText={setSearchText}
              style={{
                backgroundColor: "#f0f0f0",
                padding: 10,
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
          )}

          {/* Thẻ tích điểm */}
          <RewardCard isGuest={!user} userName={userName} />

          {/* Danh mục */}
          <CategoryList
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            navigateOnPress={true}
          />

          {/* Banner */}
          <BannerSwiper images={bannerImages} />

          {/* Khuyến mãi */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {promotions.map((promo) => (
              <PromoCard
                key={promo.id}
                title={promo.Title}
                description={promo.Description}
                discount={promo.DiscountAmount}
                terms={promo.Terms}
                onPress={() =>
                  router.push({
                    pathname: "/promotion/[id]",
                    params: { id: promo.id },
                  })
                }
              />
            ))}
          </ScrollView>

          {/* Sản phẩm bán chạy */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 12,
                color: "#333",
              }}
            >
              Sản Phẩm Bán Chạy
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {products
                .filter((p) => p.IsBestSeller)
                .map((item) => (
                  <ProductCard
                    key={item.id}
                    id={item.id}
                    name={item.Name}
                    image={item.ImageBase64}
                    price={getDisplayPrice(item)}
                    onPress={() =>
                      router.push({
                        pathname: "/product/[id]",
                        params: { id: item.id },
                      })
                    }
                  />
                ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
      {/* Giỏ hàng cố định */}
      <FloatingCartButton />
    </SafeAreaView>
  );
}
