import { createStackNavigator } from "@react-navigation/stack";
import { InventoryScreen } from "./screens/InventoryScreen";
import { CreateProductScreen } from "./screens/CreateProductScreen";
import { EditProductScreen } from "./screens/EditProductScreen";
import { ProductCategoryScreen } from "./screens/ProductCateoryScreen";

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
      <Screen
        name="EditProductScreen"
        component={EditProductScreen}
        options={{
            title: "Editar producto",
        }}
      />
      <Screen 
        name="ProductCategoryScreen"
        component={ProductCategoryScreen}
        options={{
            title: "Categoría de productos",
        }}
      />
    </Navigator>
  );
}