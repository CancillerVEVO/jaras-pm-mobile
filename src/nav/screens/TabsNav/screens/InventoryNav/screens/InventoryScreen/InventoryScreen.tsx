import { StackScreenProps } from "@react-navigation/stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { ProductSummary, useProducts } from "../../hooks/useProducts";
import { Item } from "./Item";
import { Text } from "@/components/Text";
import { useTheme } from "@react-navigation/native";
import { useProductsReport } from "../../hooks/useProductReport";
import { convertToCSV, downloadCSV } from "@/utils/csv";
import { CategorySummary, useCategories } from "../../hooks/useCategories";
import { Select, SelectItem } from "@/components/Select";


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



  const [category, setCategory] = useState<number | null>(null);



  const productQuery = useProducts(
    category === null ? undefined : category
  );

  const data = productQuery.data ?? [];

  const categoryQuery = useCategories();

  const categories = categoryQuery.data ?? [];

  const renderItem: ListRenderItem<ProductSummary> = useCallback((props) => {
    return <Item {...props} />;
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={
        <ListHeader {...{ category, setCategory, categories }} />
      }
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

function ListHeader({
  category,
  setCategory,
  categories,
}: {
  category: number | null;
  setCategory: (category: number | null) => void;
  categories: CategorySummary[];
}) {
  const productsReport = useProductsReport(
    category === null ? undefined : category
  ).data ?? [];

  return (
    <>
      <Button
        title="Generar Reporte"
        onPress={async () => {
          const csv = convertToCSV(productsReport);
          await downloadCSV(csv, `reporte_productos.csv`);
        }}
      ></Button>

      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <Select
          label="Filtrar por categoria"
          value={category}
          getLabel={(id: number) => {
            const category = categories.find((e) => e.id === id);
            return category?.name ?? "Todos";
          }}
          onChange={setCategory}
        >
          <SelectItem value={null} label="Todos" />
          {categories.map((e) => {
            return <SelectItem key={e.id} value={e.id} label={e.name} />;
          })}
        </Select>
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
