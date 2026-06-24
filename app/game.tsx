import { useGame } from "@/components/context/GameContext";
import { Text } from "@/components/Themed";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import Colors from "@/constants/Colors";
import { useResponsive } from "@/theme/responsive";
import { Ionicons } from "@expo/vector-icons";
import { randomUUID } from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type HintIcon = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
};

const GameScreen = () => {
  const { fontSize, spacing, bp } = useResponsive();
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
      if (distance <= 2) return "Very Hot!";
      else if (distance <= 5) return "Hot!";
      else return "Getting Warm!";
    } else {
      if (distance <= 20) return "Cool";
      else if (distance <= 50) return "Cold";
      else return "Freezing!";
    }
  };

  const handleGuessChange = (increment: number) => {
    const newGuess = currentGuess + increment;

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

      setTimeout(() => {
        saveRound(finalGuesses);
        router.replace("/gameover");
      }, 1500);

      setCurrentGuesses(finalGuesses);
      return;
    }

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
    <ScreenWrapper >
      {/* Header */}
      <View style={[styles.header, { padding: spacing[1] }]}>
        <Text style={[styles.title, { fontSize: fontSize["3xl"] }]}>
          Guess The Number
        </Text>
        <Text style={[styles.subtitle, { fontSize: fontSize.sm }]}>
          Use +/- buttons to guess between 0-99
        </Text>
      </View>

      {/* Hint badge — warm or cold */}
      {currentDisplay && currentDisplay !== "match" && (
        <View
          style={[
            styles.hintBadge,
            currentDisplay === "warm" ? styles.warm : styles.cold,
            {
              paddingVertical: spacing[3],
              paddingHorizontal: spacing[5],
              gap: spacing[2],
              borderRadius: spacing[2],
              minWidth: bp.isSm ? 160 : 200,
            },
          ]}
        >
          <Ionicons
            name={getHintIcon().name}
            size={20}
            color={getHintIcon().color}
          />
          <Text style={[styles.hintText, { fontSize: fontSize.base }]}>
            {hintMessage || "Start guessing!"}
          </Text>
        </View>
      )}

      {/* Match badge */}
      {currentDisplay === "match" && (
        <View
          style={[
            styles.hintBadge,
            styles.match,
            {
              paddingVertical: spacing[3],
              paddingHorizontal: spacing[5],
              gap: spacing[2],
              borderRadius: spacing[2],
            },
          ]}
        >
          <Ionicons name="trophy" size={20} color="#FFD700" />
          <Text style={[styles.hintText, { fontSize: fontSize.base }]}>
            MATCH! You win!
          </Text>
        </View>
      )}

      {/* Attempts counter */}
      {attempts > 0 && (
        <View style={[styles.attemptsContainer, { gap: spacing[2] }]}>
          <Ionicons name="analytics" size={16} color={Colors.text.muted} />
          <Text style={[styles.attemptsText, { fontSize: fontSize.sm }]}>
            Attempt #{attempts}
          </Text>
        </View>
      )}

      {/* Main card */}
      <View
        style={[
          styles.container,
          {
            padding: spacing[4],
            gap: spacing[4],
          },
        ]}
      >
        {/* Guess count */}
        <View style={[styles.guessCountContainer, { gap: spacing[1] }]}>
          <Ionicons name="list" size={14} color={Colors.text.muted} />
          <Text style={[styles.guessCount, { fontSize: fontSize.xs }]}>
            {currentGuesses.length === 0
              ? "Start guessing!"
              : `${currentGuesses.length} guess${currentGuesses.length > 1 ? "es" : ""} so far`}
          </Text>
        </View>

        {/* Current guess display */}
        <View
          style={[
            styles.guessDisplay,
            {
              paddingHorizontal: spacing[10],
              paddingVertical: spacing[5],
            },
          ]}
        >
          <Text style={[styles.guessNumber, { fontSize: fontSize["4xl"] }]}>
            {currentGuess}
          </Text>
        </View>

        {/* Control buttons */}
        <View style={[styles.controlRow, { gap: spacing[2] }]}>
          <TouchableOpacity
            style={[
              styles.controlButton,
              {
                paddingVertical: spacing[3],
                paddingHorizontal: spacing[4],
                minWidth: bp.isSm ? 50 : 60,
              },
              (!canGoLower || currentDisplay === "match") &&
                styles.disabledButton,
            ]}
            onPress={() => handleGuessChange(-1)}
            disabled={!canGoLower || currentDisplay === "match"}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={24} color="white" />
            <Text
              style={[styles.controlButtonText, { fontSize: fontSize.base }]}
            >
              1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.mainButton,
              { paddingVertical: spacing[3], paddingHorizontal: spacing[4] },
              (!canGoLower || currentDisplay === "match") &&
                styles.disabledButton,
            ]}
            onPress={() => handleGuessChange(-10)}
            disabled={!canGoLower || currentDisplay === "match"}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={24} color="white" />
            <Text
              style={[styles.controlButtonText, { fontSize: fontSize.base }]}
            >
              10
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.mainButton,
              { paddingVertical: spacing[3], paddingHorizontal: spacing[4] },
              (!canGoHigher || currentDisplay === "match") &&
                styles.disabledButton,
            ]}
            onPress={() => handleGuessChange(10)}
            disabled={!canGoHigher || currentDisplay === "match"}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text
              style={[styles.controlButtonText, { fontSize: fontSize.base }]}
            >
              10
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.controlButton,
              {
                paddingVertical: spacing[3],
                paddingHorizontal: spacing[4],
                minWidth: bp.isSm ? 50 : 60,
              },
              (!canGoHigher || currentDisplay === "match") &&
                styles.disabledButton,
            ]}
            onPress={() => handleGuessChange(1)}
            disabled={!canGoHigher || currentDisplay === "match"}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text
              style={[styles.controlButtonText, { fontSize: fontSize.base }]}
            >
              1
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reset button */}
        <TouchableOpacity
          style={[
            styles.resetButton,
            {
              paddingVertical: spacing[4],
              marginTop: spacing[2],
              gap: spacing[2],
            },
            (!gameStarted || currentDisplay === "match") &&
              styles.disabledButton,
          ]}
          onPress={handleReset}
          disabled={!gameStarted || currentDisplay === "match"}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={[styles.resetButtonText, { fontSize: fontSize.base }]}>
            Reset Game
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    color: Colors.accent,
  },
  subtitle: {
    color: Colors.text.subtitle,
  },
  hintBadge: {
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
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
    textAlign: "center",
  },
  attemptsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  attemptsText: {
    color: Colors.text.muted,
    textAlign: "center",
    fontWeight: "500",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  guessCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  guessCount: {
    color: Colors.text.muted,
  },
  guessDisplay: {
    backgroundColor: Colors.accent + "15",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: "center",
  },
  guessNumber: {
    fontWeight: "bold",
    color: Colors.accent,
  },
  controlRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  controlButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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
    fontWeight: "bold",
  },
  resetButton: {
    width: "100%",
    backgroundColor: Colors.text.muted,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  resetButtonText: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});

export default GameScreen;
