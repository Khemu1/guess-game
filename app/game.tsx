import { useGame } from "@/components/context/GameContext";
import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HintIcon = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
};

const GameScreen = () => {
  const { currentGuesses, setCurrentGuesses, saveRound } = useGame();
  const { secretNumber } = useLocalSearchParams<{ secretNumber: string }>();

  const targetNumber = useMemo(
    () => parseInt(secretNumber || "0"),
    [secretNumber],
  );

  const initialGuess = useMemo(() => {
    let randomStart;
    do {
      randomStart = Math.floor(Math.random() * 100);
    } while (randomStart === targetNumber);
    return randomStart;
  }, [targetNumber]);

  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [currentDisplay, setCurrentDisplay] = useState<
    "warm" | "cold" | "match" | null
  >(null);
  const [hintMessage, setHintMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!secretNumber) {
      router.replace("/");
    }
  }, [secretNumber]);

  const checkProximity = (guess: number) => {
    const distance = Math.abs(guess - targetNumber);
    const tenBigger = targetNumber + 10;
    const tenSmaller = targetNumber <= 10 ? 0 : targetNumber - 10;
    const isWarm = tenBigger >= guess && tenSmaller <= guess;

    setCurrentDisplay(isWarm ? "warm" : "cold");

    if (isWarm) {
      if (distance <= 2) {
        return "Very Hot!";
      } else if (distance <= 5) {
        return "Hot!";
      } else {
        return "Getting Warm!";
      }
    } else {
      if (distance <= 20) {
        return "Cool";
      } else if (distance <= 50) {
        return "Cold";
      } else {
        return "Freezing!";
      }
    }
  };

  const handleGuessChange = (increment: number) => {
    const newGuess = currentGuess + increment;

    // Prevent going outside bounds
    if (newGuess < 0 || newGuess > 99) {
      const message = newGuess < 0 ? "Can't go below 0!" : "Can't go above 99!";
      setHintMessage(message);
      return;
    }

    setCurrentGuess(newGuess);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const newObj = {
      id: randomUUID(),
      created_at: Date.now(),
      guess: newGuess.toString(),
    };

    if (newGuess === targetNumber) {
      setCurrentDisplay("match");
      setHintMessage("MATCH! You found it!");
      const finalGuesses = [...currentGuesses, { ...newObj, isMatch: true }];

      // Delay navigation to show success message
      setTimeout(() => {
        saveRound(finalGuesses);
        router.replace("/gameover");
      }, 1500);

      setCurrentGuesses(finalGuesses);
      return;
    }

    // Get hint message
    const hint = checkProximity(newGuess);
    setHintMessage(hint);

    setCurrentGuesses([...currentGuesses, newObj]);
    setGameStarted(true);
  };

  const handleReset = () => {
    setCurrentGuess(initialGuess);
    setCurrentDisplay(null);
    setHintMessage("");
    setAttempts(0);
    setGameStarted(false);
  };

  const canGoLower = currentGuess > 0;
  const canGoHigher = currentGuess < 99;

  const getHintIcon = (): HintIcon => {
    if (currentDisplay === "warm") {
      const distance = Math.abs(currentGuess - targetNumber);
      if (distance <= 2) return { name: "flame", color: "#FF4500" };
      if (distance <= 5) return { name: "flame", color: "#FF6B35" };
      return { name: "flame", color: "#FFA500" };
    }
    if (currentDisplay === "cold") {
      const distance = Math.abs(currentGuess - targetNumber);
      if (distance <= 20) return { name: "snow", color: "#4ECDC4" };
      if (distance <= 50) return { name: "snow", color: "#87CEEB" };
      return { name: "snow", color: "#4169E1" };
    }
    return { name: "help-circle", color: Colors.text.muted };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Guess The Number</Text>
          <Text style={styles.subtitle}>
            Use +/- buttons to guess between 0-99
          </Text>
        </View>

        {/* hint badge */}
        {currentDisplay && currentDisplay !== "match" && (
          <View
            style={[
              styles.hintBadge,
              currentDisplay === "warm" ? styles.warm : styles.cold,
            ]}
          >
            <Ionicons
              name={getHintIcon().name}
              size={20}
              color={getHintIcon().color}
            />
            <Text style={styles.hintText}>
              {hintMessage || "Start guessing!"}
            </Text>
          </View>
        )}

        {currentDisplay === "match" && (
          <View style={[styles.hintBadge, styles.match]}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.hintText}>MATCH! You win!</Text>
          </View>
        )}

        {/* Attempts counter */}
        {attempts > 0 && (
          <View style={styles.attemptsContainer}>
            <Ionicons name="analytics" size={16} color={Colors.text.muted} />
            <Text style={styles.attemptsText}>Attempt #{attempts}</Text>
          </View>
        )}

        <View style={styles.container}>
          <View style={styles.guessCountContainer}>
            <Ionicons name="list" size={14} color={Colors.text.muted} />
            <Text style={styles.guessCount}>
              {currentGuesses.length === 0
                ? "Start guessing!"
                : `${currentGuesses.length} guess${currentGuesses.length > 1 ? "es" : ""} so far`}
            </Text>
          </View>

          {/* Current guess display */}
          <View style={styles.guessDisplay}>
            <Text style={styles.guessNumber}>{currentGuess}</Text>
          </View>

          {/* Control buttons */}
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (!canGoLower || currentDisplay === "match") &&
                  styles.disabledButton,
              ]}
              onPress={() => handleGuessChange(-1)}
              disabled={!canGoLower || currentDisplay === "match"}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={24} color="white" />
              <Text style={styles.controlButtonText}>1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.mainButton,
                (!canGoLower || currentDisplay === "match") &&
                  styles.disabledButton,
              ]}
              onPress={() => handleGuessChange(-10)}
              disabled={!canGoLower || currentDisplay === "match"}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={24} color="white" />
              <Text style={styles.controlButtonText}>10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                styles.mainButton,
                (!canGoHigher || currentDisplay === "match") &&
                  styles.disabledButton,
              ]}
              onPress={() => handleGuessChange(10)}
              disabled={!canGoHigher || currentDisplay === "match"}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.controlButtonText}>10</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                (!canGoHigher || currentDisplay === "match") &&
                  styles.disabledButton,
              ]}
              onPress={() => handleGuessChange(1)}
              disabled={!canGoHigher || currentDisplay === "match"}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.controlButtonText}>1</Text>
            </TouchableOpacity>
          </View>

          {/* Reset button */}
          <TouchableOpacity
            style={[
              styles.resetButton,
              (!gameStarted || currentDisplay === "match") &&
                styles.disabledButton,
            ]}
            onPress={handleReset}
            disabled={!gameStarted || currentDisplay === "match"}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.resetButtonText}>Reset Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  outerContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: "transparent",
  },
  header: {
    alignItems: "center",
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.accent,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.subtitle,
  },
  hintBadge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "center",
    alignItems: "center",
    minWidth: 200,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  warm: {
    backgroundColor: Colors.warm.bg,
    borderWidth: 1,
    borderColor: Colors.warm.border,
  },
  cold: {
    backgroundColor: Colors.cold.bg,
    borderWidth: 1,
    borderColor: Colors.cold.border,
  },
  match: {
    backgroundColor: "#4CAF50",
    borderWidth: 1,
    borderColor: "#45a049",
  },
  hintText: {
    color: Colors.text.primary,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  attemptsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  attemptsText: {
    color: Colors.text.muted,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    gap: 16,
  },
  guessCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  guessCount: {
    color: Colors.text.muted,
    fontSize: 13,
  },
  guessDisplay: {
    backgroundColor: Colors.accent + "15",
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: "center",
  },
  guessNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.accent,
  },
  controlRow: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
    justifyContent: "center",
  },
  controlButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  mainButton: {
    flex: 1,
    backgroundColor: Colors.accent,
  },
  disabledButton: {
    backgroundColor: Colors.text.muted + "80",
    opacity: 0.5,
  },
  controlButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetButton: {
    width: "100%",
    backgroundColor: Colors.text.muted,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GameScreen;
