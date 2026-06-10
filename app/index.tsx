import { Text } from "@/components/Themed";
import Button from "@/components/ui/Button";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const numberRegex = RegExp("^[0-9]+$");

const StartScreen = () => {
  const router = useRouter();
  const [secretNumber, setSecretNumber] = useState("");

  const handleStartGame = () => {
    if (!secretNumber || !numberRegex.test(secretNumber)) {
      Alert.alert(
        "Invalid Number",
        "Please enter a valid number between 0 and 99",
      );
      return;
    }

    const num = parseInt(secretNumber);
    if (num < 0 || num > 99) {
      Alert.alert("Invalid Number", "Number must be between 0 and 99");
      return;
    }

    router.replace({
      pathname: "/game",
      params: { secretNumber: secretNumber },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Guess My Number</Text>
      <Text style={styles.subtitle}>
        Enter a secret number between 0 and 99
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          value={secretNumber}
          onChangeText={(text) => {
            if (numberRegex.test(text) || text === "") {
              setSecretNumber(text);
            }
          }}
          style={styles.input}
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

      <Text style={styles.infoText}>
        Your friend will try to guess this number
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.accent,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 20,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    height: 80,
    fontSize: 48,
    width: "60%",
    borderBottomColor: Colors.accent,
    color: Colors.accent,
    borderBottomWidth: 3,
    paddingVertical: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  infoText: {
    color: Colors.text.muted,
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default StartScreen;
