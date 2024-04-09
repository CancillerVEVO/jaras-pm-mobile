import { Button, FlatList, ListRenderItem } from "react-native";
import { Item } from "./Item";
import { ItemType, useEvents } from "./useEvents";
import { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { useEventReport } from "./useEventReport";
import { convertToCSV, downloadCSV } from "@/utils/csv";
export function EventsScreen({ navigation, route }: StackScreenProps<any>) {
  const { data: events, refetch } = useEvents();
  const eventReport = useEventReport().data ?? [];

  const unsubscribe = navigation.addListener("focus", () => {
    refetch();
  });

  const renderItem: ListRenderItem<ItemType> = (props) => {
    return <Item {...props} />;
  };

  return (
    <>
      <Button title="Generar Reporte" onPress={async () => {
        const csv = convertToCSV(eventReport);
        await downloadCSV(csv, `reporte_eventos.csv`);
      }}></Button>
      <FlatList data={events} renderItem={renderItem} />
    </>
  );
}
