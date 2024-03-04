import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "@/Components/Text";
import { ProductSummary } from "../../hooks/useAvailableProducts";

export function Item({
  item,
  onPress,
}: {
  item: ProductSummary;
  onPress: (item: ProductSummary) => void;
}) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View
        style={{
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>{item.name}</Text>
          <Text>$ {item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
