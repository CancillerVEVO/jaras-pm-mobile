import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useColorScheme } from "react-native";
import { RootNav } from "./nav/RootNav";
import { useMemo } from "react";

// Do not call db from here, it will not work!!!

const queryClient = new QueryClient();

export default function App() {
  const colorScheme = useColorScheme();
  const theme = useMemo(
    () => (colorScheme === "dark" ? DefaultTheme : DarkTheme),
    [colorScheme]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={theme}>
        <RootNav />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
