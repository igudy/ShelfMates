import React, { useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Svg, { Rect } from "react-native-svg";
import {
  ArrowLeftIcon,
  BellIcon,
  ChatBubbleIcon,
  CloseIcon,
  JourneyIcon,
} from "@/components/icons";
import type { NeighborProfile, ShelfBook } from "@/data/neighbors";

const atomicHabitsCover = require("../../assets/images/leftHandImage.png");

type BorrowPhase = "idle" | "accepted";

type BookDetailScreenProps = {
  neighbor: NeighborProfile;
  book: ShelfBook;
  onBack: () => void;
  onComplete: () => void;
};

function StylizedQrCode() {
  const cells = useMemo(
    () =>
      Array.from({ length: 49 }, (_, index) => ({
        id: index,
        filled: index % 3 !== 0 && index % 5 !== 1,
      })),
    []
  );

  return (
    <View className="items-center">
      <Svg width={180} height={180} viewBox="0 0 7 7">
        {cells.map((cell, index) => {
          const x = index % 7;
          const y = Math.floor(index / 7);
          if (!cell.filled) {
            return null;
          }
          return (
            <Rect
              key={cell.id}
              x={x}
              y={y}
              width={0.92}
              height={0.92}
              rx={0.18}
              fill="#3C06A7"
            />
          );
        })}
      </Svg>
    </View>
  );
}

type RequestSentSheetProps = {
  visible: boolean;
  contactName: string;
  onOkay: () => void;
  onCancel: () => void;
};

function RequestSentSheet({
  visible,
  contactName,
  onOkay,
  onCancel,
}: RequestSentSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/35">
        <SafeAreaView edges={["bottom"]} className="rounded-t-[32px] bg-white px-6 pb-6 pt-8">
          <View className="items-center">
            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-[#ECEBFB]">
              <BellIcon size={28} color="#3C06A7" />
            </View>
            <Text className="font-satoshi-black text-3xl text-[#0F172A]">
              Request Sent
            </Text>
            <Text className="mt-3 text-center font-satoshi text-base leading-6 text-[#64748B]">
              Wait for {contactName} to confirm. We&apos;ll ping you when the
              meeting node is set.
            </Text>
          </View>

          <Pressable onPress={onOkay} className="mt-8 active:opacity-90">
            <LinearGradient
              colors={["#3C06A7", "#3C06A7"]}
              style={{ borderRadius: 999 }}
            >
              <View className="items-center py-4">
                <Text className="font-satoshi-bold text-lg text-white">Okay</Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={onCancel} className="mt-5 items-center active:opacity-70">
            <Text className="font-satoshi-bold text-sm tracking-[2px] text-[#94A3B8]">
              CANCEL REQUEST
            </Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

type AddNoteModalProps = {
  visible: boolean;
  note: string;
  onChangeNote: (value: string) => void;
  onClose: () => void;
  onPost: () => void;
};

function AddNoteModal({
  visible,
  note,
  onChangeNote,
  onClose,
  onPost,
}: AddNoteModalProps) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-[28px] bg-white p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-satoshi-bold text-2xl text-[#0F172A]">
              Add note
            </Text>
            <Pressable
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-full active:opacity-70"
            >
              <CloseIcon />
            </Pressable>
          </View>

          <TextInput
            value={note}
            onChangeText={onChangeNote}
            placeholder="What should the next neighbor know about this copy?"
            placeholderTextColor="#9CA3AF"
            multiline
            className="min-h-[120px] rounded-[20px] bg-[#F3F4F6] px-4 py-4 font-satoshi text-base text-[#1C1917]"
            textAlignVertical="top"
          />

          <Pressable onPress={onPost} className="mt-5 active:opacity-90">
            <LinearGradient
              colors={["#3C06A7", "#3C06A7"]}
              style={{ borderRadius: 999 }}
            >
              <View className="items-center py-4">
                <Text className="font-satoshi-bold text-lg text-white">Post</Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

type VerifyHandoffSheetProps = {
  visible: boolean;
  contactName: string;
  onComplete: () => void;
  onCancel: () => void;
};

function VerifyHandoffSheet({
  visible,
  contactName,
  onComplete,
  onCancel,
}: VerifyHandoffSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/35">
        <SafeAreaView edges={["bottom"]} className="rounded-t-[32px] bg-white px-6 pb-6 pt-8">
          <StylizedQrCode />
          <Text className="mt-6 text-center font-satoshi-black text-3xl text-[#0F172A]">
            Verify Handoff
          </Text>
          <Text className="mt-3 text-center font-satoshi text-base leading-6 text-[#64748B]">
            Neighbor {contactName} will scan this to finalize the physical
            exchange.
          </Text>

          <Pressable onPress={onComplete} className="mt-8 active:opacity-90">
            <LinearGradient
              colors={["#3C06A7", "#3C06A7"]}
              style={{ borderRadius: 999 }}
            >
              <View className="items-center py-4">
                <Text className="font-satoshi-bold text-lg text-white">
                  Hands-off Complete
                </Text>
              </View>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={onCancel} className="mt-5 items-center active:opacity-70">
            <Text className="font-satoshi-bold text-sm tracking-[2px] text-[#94A3B8]">
              CANCEL REQUEST
            </Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default function BookDetailScreen({
  neighbor,
  book,
  onBack,
  onComplete,
}: BookDetailScreenProps) {
  const [phase, setPhase] = useState<BorrowPhase>("idle");
  const [showRequestSent, setShowRequestSent] = useState(false);
  const [showHandoff, setShowHandoff] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [note, setNote] = useState("");
  const [postedNote, setPostedNote] = useState<string | null>(null);

  const showAtomicCover = book.title === "Atomic Habits";

  const handlePrimaryAction = () => {
    if (phase === "idle") {
      setShowRequestSent(true);
      return;
    }

    setShowHandoff(true);
  };

  const handleCancelRequest = () => {
    setPhase("idle");
    setShowRequestSent(false);
    setShowHandoff(false);
  };

  return (
    <View className="flex-1 bg-[#F8F7FC]">
      <StatusBar style="dark" />

      <LinearGradient
        colors={["#ECEBFB", "#F8F7FC"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 360 }}
      />

      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="px-5 pt-2">
          <Pressable
            onPress={onBack}
            className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-md shadow-black/10 active:opacity-90"
          >
            <ArrowLeftIcon />
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-8 pt-2"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center py-4">
            {showAtomicCover ? (
              <Image
                source={atomicHabitsCover}
                resizeMode="contain"
                style={{
                  width: 220,
                  height: 280,
                  transform: [{ rotate: "8deg" }],
                }}
              />
            ) : (
              <View
                className="h-[280px] w-[220px] rounded-2xl shadow-lg shadow-black/15"
                style={{
                  backgroundColor: book.coverColor,
                  transform: [{ rotate: "8deg" }],
                }}
              />
            )}
          </View>

          <View className="mt-2 flex-row">
            <View className="flex-1 items-center">
              <Text className="font-satoshi-black text-4xl text-[#3C06A7]">
                {book.match}%
              </Text>
              <Text className="mt-1 font-satoshi-medium text-xs tracking-[2px] text-[#94A3B8]">
                VIBE MATCH
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="font-satoshi-black text-4xl text-[#0F172A]">
                0m
              </Text>
              <Text className="mt-1 font-satoshi-medium text-xs tracking-[2px] text-[#94A3B8]">
                DISTANCE
              </Text>
            </View>
          </View>

          <View className="mt-10">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <ChatBubbleIcon />
                <Text className="font-satoshi-bold text-2xl text-[#0F172A]">
                  Neighbor Notes
                </Text>
              </View>
              <Pressable
                onPress={() => setShowAddNote(true)}
                className="rounded-full bg-[#ECEBFB] px-4 py-2 active:opacity-80"
              >
                <Text className="font-satoshi-bold text-xs tracking-[1px] text-[#3C06A7]">
                  ADD NOTE
                </Text>
              </Pressable>
            </View>
            <Text className="mt-4 font-satoshi text-base text-[#94A3B8]">
              {postedNote ?? "Be the first to review this copy."}
            </Text>
          </View>

          <View className="mt-10">
            <View className="flex-row items-center gap-2">
              <JourneyIcon />
              <Text className="font-satoshi-bold text-2xl text-[#0F172A]">
                The Book&apos;s Journey
              </Text>
            </View>
            <View className="mt-4 flex-row items-center gap-3">
              <View className="h-3 w-3 rounded-full bg-[#BFDBFE]" />
              <Text className="font-satoshi-medium text-base italic text-[#3C06A7]">
                Waiting for its next reader...
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="px-6 pb-2">
          <Pressable onPress={handlePrimaryAction} className="active:opacity-90">
            <LinearGradient
              colors={["#3C06A7", "#3C06A7"]}
              style={{ borderRadius: 999 }}
            >
              <View className="items-center py-5">
                <Text className="font-satoshi-bold text-lg text-white">
                  {phase === "idle" ? "Ask to borrow" : "Simulate Acceptance"}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>

      <RequestSentSheet
        visible={showRequestSent}
        contactName={neighbor.contactName}
        onOkay={() => {
          setShowRequestSent(false);
          setPhase("accepted");
        }}
        onCancel={handleCancelRequest}
      />

      <VerifyHandoffSheet
        visible={showHandoff}
        contactName={neighbor.contactName}
        onComplete={() => {
          setShowHandoff(false);
          onComplete();
        }}
        onCancel={handleCancelRequest}
      />

      <AddNoteModal
        visible={showAddNote}
        note={note}
        onChangeNote={setNote}
        onClose={() => setShowAddNote(false)}
        onPost={() => {
          if (note.trim()) {
            setPostedNote(note.trim());
          }
          setShowAddNote(false);
          setNote("");
        }}
      />
    </View>
  );
}
