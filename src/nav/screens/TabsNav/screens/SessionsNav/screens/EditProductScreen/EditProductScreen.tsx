import { StackScreenProps } from "@react-navigation/stack";
import { useCallback, useEffect, useState } from "react";
import { ProductDetail, useProduct } from "../../hooks/useProduct";
import { FlatList, ListRenderItem, View } from "react-native";
import { Item } from "./Item";
import { Text } from "@/components/Text";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useAddToSession } from "../../hooks/useAddToSession";

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
      ListHeaderComponent={<ListHeader params={route.params} />}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      data={data}
      ListEmptyComponent={ListEmpty}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
}

function ListEmpty() {
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text style={{ color: "gray" }}>No hay productos</Text>
    </View>
  );
}

function ListHeader({ params }: { params: any }) {
  const selling_session_id = params?.selling_session_id as number;
  const id = params?.id as number;
  const name = params?.name as string;

  const mutation = useAddToSession();
  const [quantity, setQuantity] = useState("1");

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          padding: 20,
        }}
      >
        <View style={{ flex: 1 }}>
          <Input
            label="Cantidad"
            placeholder="Cantidad a agregar"
            keyboardType="numeric"
            returnKeyType="done"
            value={quantity}
            onChangeText={setQuantity}
          />
        </View>
        <Button
          onPress={() => {
            const q = parseInt(quantity);

            if (Number.isNaN(q) || q <= 0) {
              return;
            }

            mutation.mutate({
              selling_session_id,
              products: [
                {
                  product_id: id,
                  quantity: q,
                },
              ],
            });
          }}
        >
          Agregar
        </Button>
      </View>

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
