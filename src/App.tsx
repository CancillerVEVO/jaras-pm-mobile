import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { setupDatabase } from "./db/setupDatabase";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { TestDb } from "./TestDb";
import { useEffect, useState } from "react";

// Do not call db from here, it will not work!!!

const queryClient = new QueryClient();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fn = async () => {
      await setupDatabase();
      setIsLoading(false);
    };

    fn();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <TestDb />
        <View
          style={{ width: 50, height: 50, backgroundColor: "powderblue" }}
        />
        <View style={{ width: 100, height: 100, backgroundColor: "skyblue" }} />
        <View
          style={{ width: 150, height: 150, backgroundColor: "steelblue" }}
        />
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
