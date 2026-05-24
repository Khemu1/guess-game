import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

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
    flex: 1,
    backgroundColor: "#72063c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 28,
    overflow: "hidden", // important for ripple clipping
    elevation: 2,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});
