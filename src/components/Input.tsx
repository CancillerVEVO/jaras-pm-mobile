import { TextInput, TextInputProps, View } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@react-navigation/native";

export interface InputProps extends TextInputProps {
  label: string;
}

export function Input({ style, label, ...props }: InputProps) {
  const theme = useTheme();

  return (
    <View>
      <Text
        style={{
          fontWeight: "600",
        }}
      >
        {label}
      </Text>

      <TextInput
        placeholderTextColor="gray"
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.text,
            paddingVertical: 10,
            color: theme.colors.text,
          },
          style,
        ]}
        {...props}
      />
    </View>
  );
}
