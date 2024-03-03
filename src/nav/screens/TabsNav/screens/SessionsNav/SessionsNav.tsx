import { createStackNavigator } from "@react-navigation/stack";
import { SessionsScreen } from "./screens/SessionsScreen";
import { CreateSessionScreen } from "./screens/CreateSessionScreen";

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
    </Navigator>
  );
}