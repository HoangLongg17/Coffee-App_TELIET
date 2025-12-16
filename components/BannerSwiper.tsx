import React from "react";
import { Image, View } from "react-native";
import Swiper from "react-native-swiper";

interface Props {
  images: any[]; // mảng require(...) hoặc uri
}

export default function BannerSwiper({ images }: Props) {
  return (
    <View style={{ height: 160, marginBottom: 16 }}>
      <Swiper
        autoplay
        showsPagination
        dotColor="#ccc"
        activeDotColor="#B22222"
        paginationStyle={{ bottom: 10 }}
      >
        {images.map((img, index) => (
          <Image
            key={index}
            source={img}
            style={{
              width: "100%",
              height: 160,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        ))}
      </Swiper>
    </View>
  );
}
