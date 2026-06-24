// app/index.tsx
import { Text } from "@/components/Themed";
import Button from "@/components/ui/Button";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import Colors from "@/constants/Colors";
import { useResponsive } from "@/theme/responsive";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";

const numberRegex = RegExp("^[0-9]+$");

const StartScreen = () => {
  const { fontSize, spacing, bp } = useResponsive();
  const router = useRouter();
  const [secretNumber, setSecretNumber] = useState("");

  const handleStartGame = () => {
    console.log("handleStartGame fired, secretNumber:", secretNumber);

    if (!secretNumber || !numberRegex.test(secretNumber)) {
      console.log("validation failed");
      Alert.alert(
        "Invalid Number",
        "Please enter a valid number between 0 and 99",
      );
      return;
    }

    const num = parseInt(secretNumber);
    if (num < 0 || num > 99) {
      console.log("range failed");
      Alert.alert("Invalid Number", "Number must be between 0 and 99");
      return;
    }

    console.log("navigating to game with:", secretNumber);
    router.push({ pathname: "/game", params: { secretNumber } });
  };

  // useEffect(() => {
  //   console.log("GameScreen mounted, secretNumber:", secretNumber);

  //   if (secretNumber === undefined) return; // still loading
  //   if (secretNumber === null) return; // still loading
  //   if (secretNumber === "") {
  //     console.log("secretNumber empty, redirecting to index");
  //     router.replace("/");
  //   }
  // }, [secretNumber]);
  return (
    <ScreenWrapper>
      <Text
        style={[
          styles.title,
          { fontSize: fontSize["3xl"], textAlign: "center" },
        ]}
      >
        Guess My Number
      </Text>

      <Text style={[styles.subtitle, { fontSize: fontSize.base }]}>
        Enter a secret number between 0 and 99
      </Text>

      <View
        style={[
          styles.inputContainer,
          {
            padding: spacing[5],
            width: bp.isLg ? "60%" : "100%",
          },
        ]}
      >
        <TextInput
          value={secretNumber}
          onChangeText={(text) => {
            if (numberRegex.test(text) || text === "") {
              setSecretNumber(text);
            }
          }}
          style={[
            styles.input,
            {
              fontSize: fontSize["4xl"],
              height: spacing[16],
              width: bp.isSm ? "80%" : "60%",
            },
          ]}
          maxLength={2}
          inputMode="numeric"
          keyboardType="number-pad"
          placeholder="?"
          placeholderTextColor="#ddb52f55"
        />
      </View>

      <Button
        title="Start Game"
        onPress={handleStartGame}
        disabled={!secretNumber}
      />

      <Text style={[styles.infoText, { fontSize: fontSize.sm }]}>
        Your friend will try to guess this number
      </Text>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    color: Colors.accent,
  },
  subtitle: {
    color: Colors.text.primary,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    borderBottomColor: Colors.accent,
    color: Colors.accent,
    borderBottomWidth: 3,
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  infoText: {
    color: Colors.text.muted,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default StartScreen;
