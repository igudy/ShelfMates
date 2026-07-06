import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Button, Card, Chip, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { completeOnboarding, setDisplayName } from "@/store/slices/appSlice";

const FEATURES = [
  {
    title: "Build your shelf",
    description: "Catalog books you own, want, or are reading right now.",
  },
  {
    title: "Find your mates",
    description: "See what friends are reading and swap recommendations.",
  },
  {
    title: "Lend & borrow",
    description: "Track who has your copy and never lose a favorite again.",
  },
] as const;

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { displayName, hasOnboarded } = useAppSelector((state) => state.app);

  const handleGetStarted = () => {
    if (displayName.trim()) {
      dispatch(completeOnboarding());
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <View className="self-start mb-4">
            <Chip
              mode="flat"
              style={{ backgroundColor: "#D8F3DC" }}
              textStyle={{ color: "#2D6A4F", fontWeight: "600" }}
            >
              Beta preview
            </Chip>
          </View>
          <Text className="text-4xl font-bold text-foreground tracking-tight">
            ShelfMates
          </Text>
          <Text className="mt-3 text-base leading-6 text-muted-foreground">
            Your social bookshelf. Share what you read, discover what your
            mates love, and keep lending simple.
          </Text>
        </View>

        <View className="mb-6">
          <Card mode="elevated" style={{ backgroundColor: "#FFFFFF" }}>
            <Card.Content style={{ gap: 16 }}>
              <Text className="text-lg font-semibold text-foreground">
                {hasOnboarded ? `Welcome back, ${displayName}!` : "Get started"}
              </Text>
              <TextInput
                mode="outlined"
                label="Your display name"
                placeholder="e.g. Alex"
                value={displayName}
                onChangeText={(value) => dispatch(setDisplayName(value))}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <Button
                mode="contained"
                onPress={handleGetStarted}
                disabled={!displayName.trim()}
                contentStyle={{ paddingVertical: 6 }}
              >
                {hasOnboarded ? "Continue to your shelf" : "Create your shelf"}
              </Button>
            </Card.Content>
          </Card>
        </View>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          What you can do
        </Text>

        <View className="gap-3">
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              mode="outlined"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <Card.Content>
                <Text className="text-base font-semibold text-foreground">
                  {feature.title}
                </Text>
                <Text className="mt-1 text-sm leading-5 text-muted-foreground">
                  {feature.description}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {hasOnboarded ? (
          <View className="mt-8 rounded-2xl border border-border bg-muted p-5">
            <Text className="text-sm font-medium text-shelf">
              You are all set
            </Text>
            <Text className="mt-2 text-sm leading-5 text-muted-foreground">
              Next up: add your first book, invite a mate, and start building
              your shared reading circle.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
