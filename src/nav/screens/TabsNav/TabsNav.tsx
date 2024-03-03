import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { EventsScreen } from "./screens/EventsScreen";
import { InventoryNav } from "./screens/InventoryNav/InventoryNav";
import { SettingsScreen } from "./screens/SettingsScreen";
import { SessionsNav } from "./screens/SessionsNav/SessionsNav";

const Tabs = createBottomTabNavigator();
const Navigator = Tabs.Navigator;
const Screen = Tabs.Screen;

export function TabsNav() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        name="InventoryNav"
        options={{
          title: "Inventario",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="box" size={size} color={color} />
          ),
        }}
        component={InventoryNav}
      />
      <Screen
        name="SessionsNav"
        options={{
          title: "Sesiones",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="calendar" size={size} color={color} />
          ),
        }}
        component={SessionsNav}
      />
      <Screen
        name="EventsScreen"
        options={{
          headerShown: true,
          title: "Movimientos",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="scroll" size={size * 0.75} color={color} />
          ),
        }}
        component={EventsScreen}
      />
      <Screen
        name="SettingsScreen"
        options={{
          headerShown: true,
          title: "Configuración",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="cog" size={size} color={color} />
          ),
        }}
        component={SettingsScreen}
      />
    </Navigator>
  );
}
