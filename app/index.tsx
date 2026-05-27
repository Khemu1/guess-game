import GuessItem from "@/components/GuessItem";
import { View } from "@/components/Themed";
import Button from "@/components/ui/Button";
import Colors from "@/constants/Colors";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, TextInput } from "react-native";

const numberRegex = RegExp("^[0-9]+$");
const StartScreen = () => {
  const [currentGuess, setCurrentGuess] = useState(0);
  const [guesses, setGuesses] = useState<
    {
      id: string;
      guess: number;
      created_at: number;
      isMatch?: boolean;
    }[]
  >([]);
  const [currentDisplay, setCurrentDisplay] = useState<
    "warm" | "cold" | "match" | null
  >(null);
  const rando = useMemo(() => {
    return +(Math.random() * 100).toFixed(0);
  }, []);

  useEffect(() => {
    console.log("rando ", rando);
  }, []);

  useEffect(() => {
    console.log("guesses , ", guesses);
  }, [guesses]);

  const handleGuessChange = (num: string) => {
    if (numberRegex.test(num)) {
      setCurrentGuess(+num);
    }
    if (num == "") {
      setCurrentGuess(0);
    }
  };
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <TextInput
          value={currentGuess.toString()}
          onChangeText={handleGuessChange}
          style={styles.input}
          maxLength={2}
          inputMode="numeric"
          keyboardType="number-pad"
        />
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            gap: 5,
          }}
        >
          <Button
            disabled={currentDisplay === "match"}
            title="Reset"
            onPress={() => setCurrentGuess(0)}
          />
          <Button
            title="Confirm"
            disabled={currentDisplay === "match"}
            onPress={() => {
              console.log("on click");
              const tenBigger = rando + 10;
              const tenSmaller = rando <= 10 ? 0 : rando - 10;

              const id = new Date().getDate().toString(8);
              const created_at = new Date().getDate();
              const newObj = { id, created_at, guess: currentGuess };
              if (+currentGuess == +rando) {
                setCurrentDisplay("match");
                setGuesses((prev) => [...prev, { ...newObj, isMatch: true }]);
                return;
              } else if (
                tenBigger >= currentGuess &&
                tenSmaller <= currentGuess
              ) {
                setCurrentDisplay("warm");
              } else {
                setCurrentDisplay("cold");
              }
              setGuesses((prev) => [...prev, { ...newObj }]);
            }}
          />
        </View>
      </View>
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item) => item.id}
          data={guesses}
          renderItem={({ item }) => (
            <GuessItem guess={item.guess} id={item.id} isMatch={item.isMatch} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    padding: 16,
    marginTop: 100,
    marginHorizontal: 24,
    gap: 25,
  },
  container: {
    padding: 16,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4e0329",
    borderRadius: 10,
    elevation: 6,
    // for IOS users
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 6,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    height: 62,
    fontSize: 32,
    width: "80%",
    borderBottomColor: "#ddb52f",
    color: "#ddb52f",
    borderBottomWidth: 2,
    marginVertical: 20,
    paddingBlock: 10,
    borderColor: Colors.light.border,
    textAlign: "center",
  },
});

export default StartScreen;
