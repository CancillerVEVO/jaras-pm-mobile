import {
  FlatList,
  ListRenderItem,
  ScrollView,
  View,
  Button,
} from "react-native";
import { ProductSummary, useReceipt } from "../../hooks/useReceipt";
import { useCallback, useMemo } from "react";
import { Text } from "@/components/Text";
import { downloadCSV, convertToCSV } from "@/utils/csv";

const keyExtractor = (item: ProductSummary) =>
  item.selling_session_product_id.toString();

export function ReceiptScreen({ route }: any) {
  const selling_session_id = route.params.selling_session_id as number;
  const query = useReceipt(selling_session_id);
  const data = query.data ?? [];

  const total = useMemo(
    () =>
      data.reduce((total, item) => {
        return total + item.sale_price;
      }, 0),
    [data]
  );

  const renderItem: ListRenderItem<ProductSummary> = useCallback(({ item }) => {
    return (
      <View style={{ gap: 5, padding: 20 }}>
        <Text>
          <Text style={{ fontWeight: "600" }}>ID:</Text>{" "}
          {item.selling_session_product_id}
        </Text>
        <Text>
          <Text style={{ fontWeight: "600" }}>Producto:</Text>{" "}
          {item.product_name}
        </Text>
        <Text>
          <Text style={{ fontWeight: "600" }}>Fecha de venta:</Text>{" "}
          {new Date(item.sale_date).toLocaleString()}
        </Text>
        <Text>
          <Text style={{ fontWeight: "600" }}>Precio de venta:</Text> ${" "}
          {item.sale_price}
        </Text>
      </View>
    );
  }, []);

  return (
    <>
      <Button
        onPress={async () => {
          const csv = convertToCSV(data);
          console.log(csv);
          await downloadCSV(csv, "reporte.csv");
        }}
        title="Descargar Reporte"
      />
      <FlatList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        data={data}
        ItemSeparatorComponent={ItemSeparator}
      />

      <View
        style={{
          gap: 5,
          padding: 20,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "aliceblue",
        }}
      >
        <Text style={{ textAlign: "right" }}>
          <Text style={{ fontWeight: "600" }}>Total:</Text> $ {total}
        </Text>
      </View>
    </>
  );
}

function ItemSeparator() {
  return (
    <View
      style={{
        height: 1,
        marginHorizontal: 20,
        backgroundColor: "gray",
      }}
    />
  );
}
