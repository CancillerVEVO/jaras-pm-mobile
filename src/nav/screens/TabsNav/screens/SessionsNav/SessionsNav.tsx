import { createStackNavigator } from "@react-navigation/stack";
import { SessionsScreen } from "./screens/SessionsScreen";
import { CreateSessionScreen } from "./screens/CreateSessionScreen";
import { EditSessionScreen } from "./screens/EditSessionScreen";

const Stack = createStackNavigator();
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

export function SessionsNav() {
  return (
    <Navigator>
      <Screen
        name="SessionsScreen"
        component={SessionsScreen}
        options={{
            title: "Sesiones",
        }}
      />
      <Screen
        name="CreateSessionScreen"
        component={CreateSessionScreen}
        options={{
            title: "Crear sesión",
        }}
      />
      <Screen
        name="EditSessionScreen"
        component={EditSessionScreen}
        options={{
            title: "Editar sesión",
        }}
      />
    </Navigator>
  );
}