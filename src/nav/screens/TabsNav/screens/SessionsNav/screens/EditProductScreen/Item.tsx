import { View } from "react-native";
import { ProductDetail } from "../../hooks/useProduct";
import { Text } from "@/Components/Text";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";

export function Item({ item }: { item: ProductDetail }) {
  const mutation = useDeleteProduct({
    product_id: item.product_id,
    id: item.selling_session_product_id,
    selling_session_id: item.selling_session_id,
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <Text>{item.selling_session_product_id}</Text>
      <Text>{item.is_sold ? "✅" : "❌"}</Text>
      {!item.is_sold ? (
        <Text onPress={() => mutation.mutate()}>🗑️</Text>
      ) : (
        <View style={{ width: 20 }} />
      )}
    </View>
  );
}
