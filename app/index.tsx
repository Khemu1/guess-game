import { View } from "@/components/Themed";
import Button from "@/components/ui/Button";
import Colors from "@/constants/Colors";
import { StyleSheet, TextInput } from "react-native";

const StartScreen = () => {
  return (
    <View style={styles.container}>
      <TextInput
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
        <Button title="Reset" />
        <Button title="Confirm" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    marginHorizontal: 24,
    padding: 16,
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
