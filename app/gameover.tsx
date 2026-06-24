import { useGame } from "@/components/context/GameContext";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useResponsive } from "@/theme/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const successImage = require("@/assets/images/success.png");

export default function GameOverScreen() {
  const { fontSize, spacing, bp } = useResponsive();
  const { rounds } = useGame();
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());

  const toggleRound = (index: number) => {
    setExpandedRounds((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const latestRound = rounds[rounds.length - 1];
  const bestRound = rounds.reduce((best, round) => {
    const matchGuess = round.guesses.find((g) => g.isMatch);
    if (!matchGuess) return best;
    return !best || round.guesses.length < best.guesses.length ? round : best;
  }, rounds[0]);

  const imageSize = bp.isSm ? 90 : 120;

  // Everything above the list goes here
  const ListHeader = () => (
    <>
      {/* Success Header */}
      <View
        style={[
          styles.successSection,
          { paddingTop: spacing[4], gap: spacing[4] },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={successImage}
            style={[
              styles.image,
              {
                width: imageSize,
                height: imageSize,
                borderRadius: imageSize / 2,
              },
            ]}
          />
          <View
            style={[
              styles.trophyBadge,
              { width: spacing[10], height: spacing[10] },
            ]}
          >
            <Ionicons name="trophy" size={24} color={Colors.accent} />
          </View>
        </View>

        <View style={[styles.titleContainer, { gap: spacing[3] }]}>
          <Ionicons name="star" size={24} color={Colors.accent} />
          <Text style={[styles.title, { fontSize: fontSize["3xl"] }]}>
            You Won!
          </Text>
          <Ionicons name="star" size={24} color={Colors.accent} />
        </View>

        <Text style={[styles.congratsText, { fontSize: fontSize.base }]}>
          Amazing job! You cracked the code!
        </Text>
      </View>

      {/* Stats Cards */}
      <View
        style={[
          styles.statsContainer,
          { paddingHorizontal: spacing[5], gap: spacing[3] },
        ]}
      >
        <View
          style={[styles.statCard, { padding: spacing[4], gap: spacing[2] }]}
        >
          <Ionicons name="layers" size={24} color={Colors.accent} />
          <Text style={[styles.statNumber, { fontSize: fontSize["2xl"] }]}>
            {rounds.length}
          </Text>
          <Text style={[styles.statLabel, { fontSize: fontSize.xs }]}>
            Total Rounds
          </Text>
        </View>

        {latestRound && (
          <View
            style={[styles.statCard, { padding: spacing[4], gap: spacing[2] }]}
          >
            <Ionicons name="bulb" size={24} color={Colors.accent} />
            <Text style={[styles.statNumber, { fontSize: fontSize["2xl"] }]}>
              {latestRound.guesses.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.xs }]}>
              Last Round
            </Text>
          </View>
        )}

        {bestRound && (
          <View
            style={[styles.statCard, { padding: spacing[4], gap: spacing[2] }]}
          >
            <Ionicons name="speedometer" size={24} color={Colors.match} />
            <Text style={[styles.statNumber, { fontSize: fontSize["2xl"] }]}>
              {bestRound.guesses.length}
            </Text>
            <Text style={[styles.statLabel, { fontSize: fontSize.xs }]}>
              Best Round
            </Text>
          </View>
        )}
      </View>

      {/* History Header */}
      <View
        style={[
          styles.historyHeader,
          { gap: spacing[2], padding: spacing[5], paddingBottom: 0 },
        ]}
      >
        <Ionicons name="time" size={20} color={Colors.accent} />
        <Text style={[styles.historyTitle, { fontSize: fontSize.lg }]}>
          Game History
        </Text>
      </View>
    </>
  );

  // Footer with Play Again button
  const ListFooter = () => (
    <TouchableOpacity
      style={[
        styles.playAgainButton,
        {
          marginHorizontal: spacing[5],
          marginVertical: spacing[5],
          paddingVertical: spacing[4],
          gap: spacing[2],
        },
      ]}
      onPress={() => router.replace("/")}
      activeOpacity={0.8}
    >
      <Ionicons name="play" size={20} color={Colors.primary} />
      <Text style={[styles.playAgainText, { fontSize: fontSize.lg }]}>
        Play Again
      </Text>
    </TouchableOpacity>
  );

  // Empty state
  const ListEmpty = () => (
    <View
      style={[
        styles.emptyState,
        { paddingVertical: spacing[10], gap: spacing[3] },
      ]}
    >
      <Ionicons name="game-controller" size={40} color={Colors.text.muted} />
      <Text style={[styles.emptyText, { fontSize: fontSize.base }]}>
        No rounds played yet
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={rounds}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          styles.listContent,
          {
            gap: spacing[3],
            padding: spacing[4],
          },
        ]}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.roundCard, { padding: spacing[4] }]}
            onPress={() => toggleRound(index)}
            activeOpacity={0.7}
          >
            <View style={styles.roundHeader}>
              <View style={[styles.roundInfo, { gap: spacing[3] }]}>
                <View
                  style={[
                    styles.roundBadge,
                    {
                      paddingHorizontal: spacing[3],
                      paddingVertical: spacing[1],
                    },
                  ]}
                >
                  <Text
                    style={[styles.roundBadgeText, { fontSize: fontSize.sm }]}
                  >
                    #{index + 1}
                  </Text>
                </View>
                <Text style={[styles.roundTitle, { fontSize: fontSize.base }]}>
                  {item.guesses.length} guess
                  {item.guesses.length !== 1 ? "es" : ""}
                </Text>
              </View>
              <Ionicons
                name={expandedRounds.has(index) ? "chevron-up" : "chevron-down"}
                size={20}
                color={Colors.text.muted}
              />
            </View>

            {expandedRounds.has(index) && (
              <View
                style={[
                  styles.guessesContainer,
                  { marginTop: spacing[4], paddingTop: spacing[4] },
                ]}
              >
                <View style={[styles.guessFlow, { gap: spacing[2] }]}>
                  {item.guesses.map((g, i) => (
                    <View
                      key={g.id}
                      style={[styles.guessItem, { gap: spacing[3] }]}
                    >
                      <View style={styles.guessDot}>
                        {g.isMatch ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={Colors.match}
                          />
                        ) : (
                          <View style={styles.dot} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.guessText,
                          { fontSize: fontSize.lg },
                          g.isMatch && styles.matchText,
                        ]}
                      >
                        {g.guess}
                      </Text>
                      {i < item.guesses.length - 1 && (
                        <View style={styles.connector} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

// Only static styles remain here
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  successSection: {
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  trophyBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontFamily: "open-sans-bold",
    color: Colors.accent,
  },
  congratsText: {
    color: Colors.text.subtitle,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statNumber: {
    fontFamily: "open-sans-bold",
    color: Colors.accent,
  },
  statLabel: {
    color: Colors.text.muted,
    textAlign: "center",
  },
  historySection: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyTitle: {
    fontFamily: "open-sans-bold",
    color: Colors.text.primary,
  },
  listContent: {},
  roundCard: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent + "20",
  },
  roundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roundInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  roundBadge: {
    backgroundColor: Colors.accent + "20",
    borderRadius: 8,
  },
  roundBadgeText: {
    fontFamily: "open-sans-bold",
    color: Colors.accent,
  },
  roundTitle: {
    fontFamily: "open-sans-bold",
    color: Colors.text.primary,
  },
  guessesContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.accent + "10",
  },
  guessFlow: {},
  guessItem: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  guessDot: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.muted,
  },
  guessText: {
    fontFamily: "open-sans",
    color: Colors.text.primary,
  },
  matchText: {
    color: Colors.match,
    fontFamily: "open-sans-bold",
  },
  connector: {
    position: "absolute",
    left: 15,
    top: 32,
    width: 2,
    height: 16,
    backgroundColor: Colors.accent + "20",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: Colors.text.muted,
  },
  playAgainButton: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
  },
  playAgainText: {
    color: Colors.primary,
    fontFamily: "open-sans-bold",
  },
});
