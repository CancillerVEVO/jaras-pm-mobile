import { createStackNavigator } from "@react-navigation/stack";
import { LoadingScreen } from "./screens/LoadingScreen";
import { TabsNav } from "./screens/TabsNav/TabsNav";
import { useQuery } from "@tanstack/react-query";
import { setupDatabase } from "@/db/setupDatabase";

const Stack = createStackNavigator();
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

export function RootNav() {
  const query = useQuery({
    queryKey: ["setupDatabase"],
    queryFn: () => setupDatabase(),
  });

  return (
    <Navigator>
      {query.isLoading ? (
        <Screen
          name="LoadingScreen"
          options={{
            headerShown: false,
          }}
          component={LoadingScreen}
        />
      ) : (
        <Screen
          name="TabsNav"
          options={{
            headerShown: false,
          }}
          component={TabsNav}
        />
      )}
    </Navigator>
  );
}
