import { useGame } from "@/components/context/GameContext";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Success Header */}
        <View style={styles.successSection}>
          <View style={styles.imageContainer}>
            <Image source={successImage} style={styles.image} />
            <View style={styles.trophyBadge}>
              <Ionicons name="trophy" size={24} color={Colors.accent} />
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Ionicons name="star" size={24} color={Colors.accent} />
            <Text style={styles.title}>You Won!</Text>
            <Ionicons name="star" size={24} color={Colors.accent} />
          </View>

          <Text style={styles.congratsText}>
            Amazing job! You cracked the code!
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="layers" size={24} color={Colors.accent} />
            <Text style={styles.statNumber}>{rounds.length}</Text>
            <Text style={styles.statLabel}>Total Rounds</Text>
          </View>

          {latestRound && (
            <View style={styles.statCard}>
              <Ionicons name="bulb" size={24} color={Colors.accent} />
              <Text style={styles.statNumber}>
                {latestRound.guesses.length}
              </Text>
              <Text style={styles.statLabel}>Last Round</Text>
            </View>
          )}

          {bestRound && (
            <View style={styles.statCard}>
              <Ionicons name="speedometer" size={24} color={Colors.match} />
              <Text style={styles.statNumber}>{bestRound.guesses.length}</Text>
              <Text style={styles.statLabel}>Best Round</Text>
            </View>
          )}
        </View>

        {/* Rounds History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Ionicons name="time" size={20} color={Colors.accent} />
            <Text style={styles.historyTitle}>Game History</Text>
          </View>

          {rounds.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="game-controller"
                size={40}
                color={Colors.text.muted}
              />
              <Text style={styles.emptyText}>No rounds played yet</Text>
            </View>
          ) : (
            <FlatList
              data={rounds}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={styles.listContent}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.roundCard}
                  onPress={() => toggleRound(index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.roundHeader}>
                    <View style={styles.roundInfo}>
                      <View style={styles.roundBadge}>
                        <Text style={styles.roundBadgeText}>#{index + 1}</Text>
                      </View>
                      <View>
                        <Text style={styles.roundTitle}>
                          {item.guesses.length} guess
                          {item.guesses.length !== 1 ? "es" : ""}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={
                        expandedRounds.has(index)
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={20}
                      color={Colors.text.muted}
                    />
                  </View>

                  {expandedRounds.has(index) && (
                    <View style={styles.guessesContainer}>
                      <View style={styles.guessFlow}>
                        {item.guesses.map((g, i) => (
                          <View key={g.id} style={styles.guessItem}>
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
          )}
        </View>

        {/* Play Again Button */}
        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={() => router.replace("/")}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={20} color={Colors.primary} />
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 20,
  },

  // Success Section
  successSection: {
    alignItems: "center",
    paddingTop: 20,
    gap: 12,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.accent,
  },
  trophyBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: "open-sans-bold",
    color: Colors.accent,
  },
  congratsText: {
    fontSize: 16,
    color: Colors.text.subtitle,
    textAlign: "center",
  },

  // Stats Section
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "open-sans-bold",
    color: Colors.accent,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.muted,
    textAlign: "center",
  },

  // History Section
  historySection: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontFamily: "open-sans-bold",
    color: Colors.text.primary,
  },
  listContent: {
    gap: 12,
    paddingBottom: 20,
  },

  // Round Cards
  roundCard: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
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
    gap: 12,
  },
  roundBadge: {
    backgroundColor: Colors.accent + "20",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roundBadgeText: {
    fontSize: 14,
    fontFamily: "open-sans-bold",
    color: Colors.accent,
  },
  roundTitle: {
    fontSize: 16,
    fontFamily: "open-sans-bold",
    color: Colors.text.primary,
  },

  // Guesses Flow
  guessesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.accent + "10",
  },
  guessFlow: {
    gap: 8,
  },
  guessItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    fontSize: 18,
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

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.muted,
  },

  // Play Again Button
  playAgainButton: {
    backgroundColor: Colors.accent,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
  },
  playAgainText: {
    color: Colors.primary,
    fontSize: 18,
    fontFamily: "open-sans-bold",
  },
});
