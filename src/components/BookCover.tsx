import React from "react";
import { Image, View, type ImageSourcePropType } from "react-native";

type BookCoverProps = {
  coverImage?: ImageSourcePropType;
  coverColor: string;
  className?: string;
};

export default function BookCover({
  coverImage,
  coverColor,
  className = "rounded-lg",
}: BookCoverProps) {
  if (coverImage) {
    return (
      <Image
        source={coverImage}
        className={className}
        resizeMode="cover"
      />
    );
  }

  return (
    <View className={className} style={{ backgroundColor: coverColor }} />
  );
}
