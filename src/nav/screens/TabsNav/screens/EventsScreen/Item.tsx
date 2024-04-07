import { Text } from "@/components/Text";
import { View } from "react-native";
import { useEventTypes } from "./useEventTypes";
import { ItemType } from "./useEvents";

type ItemProps = {
  item: ItemType;
  index: number;
};

export function Item({ item, index }: ItemProps) {
  const eventTypes = useEventTypes().data;

  const eventType = eventTypes?.find(
    (event) => event.id === item.event_type_id
  );
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
        <Text>{item.created_at}</Text>
      </View>
    </View>
  );
}
