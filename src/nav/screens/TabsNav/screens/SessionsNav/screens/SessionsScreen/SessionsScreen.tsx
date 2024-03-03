import { StackScreenProps } from "@react-navigation/stack";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export function SessionsScreen({ navigation }: StackScreenProps<any>) {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate("CreateSessionScreen")}
        >
          <AntDesign name="pluscircle" size={32} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return null;
}
