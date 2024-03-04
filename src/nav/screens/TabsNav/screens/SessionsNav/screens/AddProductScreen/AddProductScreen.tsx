import { StackScreenProps } from "@react-navigation/stack";
import { z } from "zod";
import { EditProductSchema } from "../../hooks/useEditSession";
import { useCallback, useEffect, useState } from "react";
import { FlatList, ListRenderItem, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Item } from "./Item";
import { Text } from "@/Components/Text";
import { useTheme } from "@react-navigation/native";
import {
  ProductSummary,
  useAvailableProducts,
} from "../../hooks/useAvailableProducts";
import { Input } from "@/Components/Input";

const keyExtractor = (item: ProductSummary) => item.id.toString();

export function AddProductScreen({ route, navigation }: StackScreenProps<any>) {
  const exclude = route.params?.exclude as number[];
  const onAdd = route.params?.onAdd as (
    product: z.input<typeof EditProductSchema>
  ) => void;

  const theme = useTheme();

  const query = useAvailableProducts(exclude);
  const data = query.data ?? [];

  const [quantity, setQuantity] = useState("1");

  const renderItem: ListRenderItem<ProductSummary> = useCallback((props) => {
    const onPress = (item: ProductSummary) => {
      const q = parseInt(quantity, 10);

      if (Number.isNaN(q) || q <= 0) {
        return;
      }

      onAdd({
        ...item,
        product_id: item.id,
        quantity: q.toString(),
      });
      navigation.goBack();
    };

    return <Item {...props} onPress={onPress} />;
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={
        <ListHeader quantity={quantity} setQuantity={setQuantity} />
      }
      ListEmptyComponent={ListEmpty}
      keyboardShouldPersistTaps="handled"
    />
  );
}

function ListEmpty() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <Text>No hay productos disponibles</Text>
    </View>
  );
}

function ItemSeparator() {
  return (
    <View
      style={{ height: 1, backgroundColor: "gray", marginHorizontal: 20 }}
    />
  );
}

function ListHeader({
  quantity,
  setQuantity,
}: {
  quantity: string;
  setQuantity: (quantity: string) => void;
}) {
  return (
    <>
      <View
        style={{
          padding: 20,
        }}
      >
        <Input
          autoFocus
          label="Cantidad"
          keyboardType="numeric"
          placeholder="Cantidad"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <View>
          <Text style={{ fontWeight: "600" }}>Nombre</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "600" }}>Precio</Text>
        </View>
      </View>

      <ItemSeparator />
    </>
  );
}
