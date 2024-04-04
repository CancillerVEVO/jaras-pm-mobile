import { Text as RNText, TextProps } from "react-native";
import { useTheme } from "@react-navigation/native";

export function Text({ style, ...props }: TextProps) {
  const theme = useTheme();

  return <RNText {...props} style={[{ color: theme.colors.text }, style]} />;
}
