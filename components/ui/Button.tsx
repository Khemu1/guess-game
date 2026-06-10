import Colors from "@/constants/Colors";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Text } from "@/components/Themed";

interface ButtonProps {
  onPress?: () => void;
  title?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  onPress,
  title,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: "rgba(255,255,255,0.3)" }}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && { opacity: 0.9 },
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title || "Press me"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 2,
  },
  text: {
    color: Colors.text.primary,
    textAlign: "center",
  },
});
