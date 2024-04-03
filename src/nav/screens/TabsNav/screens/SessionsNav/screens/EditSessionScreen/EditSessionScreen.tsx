import { Text } from "@/Components/Text";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { useEditSession } from "../../hooks/useEditSession";
import { useSession } from "../../hooks/useSession";
import { Products } from "./Products";

export function EditSessionScreen({
  route,
  navigation,
}: StackScreenProps<any>) {
  const id = route.params?.id as number;

  const query = useSession(id);
  const mutation = useEditSession(id);

  const data = query.data;

  useEffect(() => {
    navigation.setOptions({
      title: data?.name ?? "",
    });
  }, [navigation, data?.name]);

  if (query.isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "gray" }}>Sesión no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Products products={data.products} />
    </ScrollView>
  );
}
