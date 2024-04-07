import { FlatList, ListRenderItem } from "react-native";
import { Item } from "./Item";
import { ItemType, useEvents } from "./useEvents";
import { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
export function EventsScreen({ navigation, route }: StackScreenProps<any>) {
  const {data: events, refetch} = useEvents();

  const unsubscribe = navigation.addListener("focus", () => {
    refetch();
  });

  const renderItem: ListRenderItem<ItemType> = (props) => {
    return <Item {...props} />;
  };

  return <FlatList data={events} renderItem={renderItem} />;
}
