import { createStackNavigator } from "@react-navigation/stack";
import { InventoryScreen } from "./screens/InventoryScreen";
import { CreateProductScreen } from "./screens/CreateProductScreen";

const Stack = createStackNavigator();
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

export function InventoryNav() {
  return (
    <Navigator>
      <Screen
        name="InventoryScreen"
        component={InventoryScreen}
        options={{
            title: "Inventario",
        }}
      />
      <Screen
        name="CreateProductScreen"
        component={CreateProductScreen}
        options={{
            title: "Crear producto",
        }}
      />
    </Navigator>
  );
}