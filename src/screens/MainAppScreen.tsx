import React, { useState } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { PlusIcon } from "@/components/icons";
import { BottomTabBar, type TabId } from "@/components/BottomTabBar";
import { getNearbySheetHeight, TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppDispatch } from "@/store/hooks";
import { addScannedBooks } from "@/store/slices/appSlice";
import type { NeighborProfile, ShelfBook } from "@/data/neighbors";
import NearbyScreen from "@/screens/NearbyScreen";
import ShelfScreen from "@/screens/ShelfScreen";
import BioScreen from "@/screens/BioScreen";
import ScanBookScreen from "@/screens/ScanBookScreen";
import NeighborProfileScreen from "@/screens/NeighborProfileScreen";
import BookDetailScreen from "@/screens/BookDetailScreen";
import NotificationsScreen from "@/screens/NotificationsScreen";

const SCANNED_BOOK_COUNT = 9;

type BookSelection = {
  neighbor: NeighborProfile;
  book: ShelfBook;
};

export default function MainAppScreen() {
  const dispatch = useAppDispatch();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const sheetHeight = getNearbySheetHeight(screenHeight);
  const scanButtonWidth = screenWidth * 0.5;
  const scanButtonHeight = 56;
  const scanButtonBottom =
    TAB_BAR_HEIGHT + sheetHeight - scanButtonHeight / 2;
  const [activeTab, setActiveTab] = useState<TabId>("nearby");
  const [showScan, setShowScan] = useState(false);
  const [selectedNeighbor, setSelectedNeighbor] =
    useState<NeighborProfile | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookSelection | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSimulateScan = () => {
    dispatch(addScannedBooks(SCANNED_BOOK_COUNT));
    setShowScan(false);
    setActiveTab("shelf");
  };

  const handleNeighborSnap = (neighbor: NeighborProfile) => {
    setSelectedNeighbor(neighbor);
    setSelectedBook(null);
  };

  const handleCloseProfile = () => {
    setSelectedNeighbor(null);
    setSelectedBook(null);
  };

  const handleBorrowComplete = () => {
    setSelectedBook(null);
    setSelectedNeighbor(null);
    setActiveTab("nearby");
  };

  if (showNotifications) {
    return (
      <NotificationsScreen onBack={() => setShowNotifications(false)} />
    );
  }

  if (showScan) {
    return (
      <ScanBookScreen
        onBack={() => setShowScan(false)}
        onSimulateScan={handleSimulateScan}
      />
    );
  }

  if (selectedBook) {
    return (
      <BookDetailScreen
        neighbor={selectedBook.neighbor}
        book={selectedBook.book}
        onBack={() => setSelectedBook(null)}
        onComplete={handleBorrowComplete}
      />
    );
  }

  if (selectedNeighbor) {
    return (
      <NeighborProfileScreen
        neighbor={selectedNeighbor}
        onBack={handleCloseProfile}
        onBookPress={(book) =>
          setSelectedBook({ neighbor: selectedNeighbor, book })
        }
      />
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <View className="flex-1">
        {activeTab === "nearby" ? (
          <NearbyScreen
            onNeighborSnap={handleNeighborSnap}
            onOpenNotifications={() => setShowNotifications(true)}
          />
        ) : null}
        {activeTab === "shelf" ? <ShelfScreen /> : null}
        {activeTab === "bio" ? <BioScreen /> : null}
      </View>

      {activeTab === "nearby" ? (
        <Pressable
          onPress={() => setShowScan(true)}
          style={{
            position: "absolute",
            bottom: scanButtonBottom,
            left: (screenWidth - scanButtonWidth) / 2,
            width: scanButtonWidth,
            height: scanButtonHeight,
            zIndex: 30,
          }}
          className="active:opacity-90"
        >
          <LinearGradient
            colors={["#3C06A7", "#3C06A7"]}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#3C06A7",
              shadowOpacity: 0.35,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 8,
            }}
          >
            <PlusIcon size={28} />
          </LinearGradient>
        </Pressable>
      ) : null}

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
