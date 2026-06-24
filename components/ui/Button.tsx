import { Text } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useResponsive } from "@/theme/responsive";
import {
  Pressable,
  StyleProp,
  StyleSheet,
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
  const { bp, spacing } = useResponsive();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: "rgba(255,255,255,0.3)" }}
      style={({ pressed }) => [
        styles.button,
        {
          paddingVertical: spacing[4],
          paddingHorizontal: spacing[4],
          borderRadius: bp.isSm ? spacing[2] : spacing[3],
        },
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
    overflow: "hidden",
    elevation: 2,
  },
  text: {
    color: Colors.text.primary,
    textAlign: "center",
  },
});
