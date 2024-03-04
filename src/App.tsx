import {
  NavigationContainer,
  DefaultTheme,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootNav } from "./nav/RootNav";

// Do not call db from here, it will not work!!!

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={DefaultTheme}>
        <RootNav />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
