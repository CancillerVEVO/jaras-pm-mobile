import { FlatList, ListRenderItem } from "react-native";
import { Item, ItemType } from "./Item";

const mockData: ItemType[] = [
  {
    id: 1,
    event_type_id: 1,
    description: "Evento 1",
    created_at: new Date(),
  },
  {
    id: 2,
    event_type_id: 2,
    description: "Evento 2",
    created_at: new Date(),
  },
  {
    id: 3,
    event_type_id: 3,
    description: "Evento 3",
    created_at: new Date(),
  },
  {
    id: 4,
    event_type_id: 4,
    description: "Naranja de 'Evento 1'",
    created_at: new Date(),
  },
  {
    id: 5,
    event_type_id: 4,
    description: "Naranja de 'Evento 1'",
    created_at: new Date(),
  },
  {
    id: 6,
    event_type_id: 4,
    description: "Naranja de 'Evento 1'",
    created_at: new Date(),
  },
];


export function EventsScreen() {
  const renderItem: ListRenderItem<ItemType> = (props) => {
    return <Item {...props} />;
  };

  return <FlatList data={mockData} renderItem={renderItem} />;
}
