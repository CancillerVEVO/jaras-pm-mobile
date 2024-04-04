import { StackScreenProps } from "@react-navigation/stack";
import { useCallback, useEffect } from "react";
import { FlatList, ListRenderItem, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ProductSummary, useProducts } from "../../hooks/useProducts";
import { Item } from "./Item";
import { Text } from "@/components/Text";
import { useTheme } from "@react-navigation/native";

const keyExtractor = (item: ProductSummary) => item.id.toString();

export function InventoryScreen({ navigation }: StackScreenProps<any>) {
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate("CreateProductScreen")}
        >
          <AntDesign name="pluscircle" size={32} color={theme.colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const query = useProducts();
  const data = query.data ?? [];

  const renderItem: ListRenderItem<ProductSummary> = useCallback((props) => {
    return <Item {...props} />;
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={ListHeader}
    />
  );
}

function ItemSeparator() {
  return (
    <View
      style={{ height: 1, backgroundColor: "gray", marginHorizontal: 20 }}
    />
  );
}

function ListHeader() {
  return (
    <>
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
