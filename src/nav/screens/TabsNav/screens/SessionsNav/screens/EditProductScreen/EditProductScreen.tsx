import { StackScreenProps } from "@react-navigation/stack";
import { useCallback, useEffect } from "react";
import { ProductDetail, useProduct } from "../../hooks/useProduct";
import { FlatList, ListRenderItem, View } from "react-native";
import { Item } from "./Item";
import { Text } from "@/Components/Text";

const keyExtractor = (item: ProductDetail) =>
  item.selling_session_product_id.toString();

export function EditProductScreen({
  route,
  navigation,
}: StackScreenProps<any>) {
  const selling_session_id = route.params?.selling_session_id as number;
  const id = route.params?.id as number;
  const name = route.params?.name as string;

  useEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [name]);

  const query = useProduct({
    id,
    selling_session_id,
  });

  const data = query.data ?? [];

  const renderItem = useCallback<ListRenderItem<ProductDetail>>(({ item }) => {
    return <Item item={item} />;
  }, []);

  return (
    <FlatList
      ListHeaderComponent={
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
              }}
            >
              ID
            </Text>
            <Text style={{ fontWeight: "bold" }}>Vendido</Text>
            <Text style={{ fontWeight: "bold" }}>Eliminar</Text>
          </View>

          <ItemSeparator />
        </View>
      }
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      data={data}
      ListEmptyComponent={
        <View
          style={{
            padding: 20,
          }}
        >
          <Text style={{ color: "gray" }}>No hay productos</Text>
        </View>
      }
      ItemSeparatorComponent={ItemSeparator}
    />
  );
}

function ItemSeparator() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: "gray",
        marginHorizontal: 20,
      }}
    />
  );
}
