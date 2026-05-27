import { Text, View } from "@/components/Themed";
import { FC } from "react";

const GuessItem: FC<{
  id: string;
  guess: number;
  isMatch?: boolean;
}> = (item) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {item.guess}
      </Text>
      {item.isMatch && (
        <Text
          style={{
            fontWeight: "bold",
            color: "#ddb52f",
            fontSize: 20,
          }}
        >
          MATCH
        </Text>
      )}
    </View>
  );
};

export default GuessItem;
