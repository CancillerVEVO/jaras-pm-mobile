import { Text } from "@/components/Text";
import { View } from "react-native";

export type ItemType = {
  id: number;
  event_type_id: number;
  description: string;
  created_at: Date;
};

type ItemProps = {
  item: ItemType;
  index: number;
};

type EventType = {
  id: number;
  name: string;
  color: string;
};

const eventTypes: EventType[] = [
  {
    id: 1,
    name: "Sesion creada",
    color: "#4CAF50",
  },
  {
    id: 2,
    name: "Sesión activada",
    color: "#2196F3",
  },
  {
    id: 3,
    name: "Sesión cerrada",
    color: "#D32F2F",
  },
  {
    id: 4,
    name: "Producto vendido",
    color: "#ED733C",
  },
];

export function Item({ item, index }: ItemProps) {
  const eventType = eventTypes.find((event) => event.id === item.event_type_id);
  const circleColor = eventType ? eventType.color : "#000";

  return (
    <View
      style={{
        flexDirection: index % 2 === 0 ? "row" : "row-reverse",
      }}
    >
      <View
        style={{
          flex: 1,
          borderRightWidth: index % 2 === 0 ? 1 : 0,
          borderRightColor: "black",
          padding: 20,
          justifyContent: "center",
          alignItems: index % 2 === 0 ? "flex-end" : "flex-start",
        }}
      >
        <View
          style={{
            width: 120,
            height: 120,
            backgroundColor: circleColor, // Cambiar el color del círculo según el tipo de evento
            borderRadius: 9999,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
            gap: 5,
          }}
        >
          <Text
            style={{ color: "white", textAlign: "center", fontWeight: "600" }}
          >
            {eventType?.name}
          </Text>

          <Text style={{ color: "white", textAlign: "center" }}>
            {item.description}
          </Text>
        </View>
      </View>

      <View
        style={{
          borderRightWidth: index % 2 === 0 ? 0 : 1,
          flex: 1,
          padding: 20,
          alignItems: index % 2 === 0 ? "flex-start" : "flex-end",
          justifyContent: "center",
        }}
      >
        <Text>{item.created_at.toDateString()}</Text>
      </View>
    </View>
  );
}
