import { TouchableOpacity, View } from "react-native";
import { ProductSummary } from "../../hooks/useProducts";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Text } from "@/components/Text";

export function Item({ item }: { item: ProductSummary }) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("EditProductScreen", { id: item.id });
      }}
    >
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
