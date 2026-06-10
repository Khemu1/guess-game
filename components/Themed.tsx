import { Text as DefaultText, View as DefaultView } from "react-native";
import type {
  TextProps as DefaultTextProps,
  ViewProps as DefaultViewProps,
} from "react-native";

export function Text(props: DefaultTextProps) {
  const { style, ...otherProps } = props;

  return (
    <DefaultText
      style={[{ fontFamily: "open-sans", color: "white" }, style]}
      {...otherProps}
    />
  );
}

export function View(props: DefaultViewProps) {
  const { style, ...otherProps } = props;

  return <DefaultView style={[style]} {...otherProps} />;
}
