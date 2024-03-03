import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";

export interface ButtonProps {
  children: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ children, onPress, disabled }: ButtonProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 5,
          opacity: disabled ? 0.65 : 1,
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
