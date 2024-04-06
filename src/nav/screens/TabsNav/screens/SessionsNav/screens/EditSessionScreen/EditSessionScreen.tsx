import { Text } from "@/components/Text";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { useSession } from "../../hooks/useSession";
import { Products } from "./Products";
import { useDownloadPdf } from "../../hooks/useDownloadPdf";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function EditSessionScreen({
  route,
  navigation,
}: StackScreenProps<any>) {
  const id = route.params?.id as number;

  const query = useSession(id);

  const downloadPdfMutation = useDownloadPdf(id);

  const data = query.data;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: data?.name ?? "",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={32}
            color="black"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, data?.name, downloadPdfMutation.mutate]);

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
    <>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          gap: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Products products={data.products} />
      </ScrollView>

      <Modal transparent statusBarTranslucent visible={isVisible}>
        <Pressable
          onPress={() => setIsVisible(false)}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "white",
              width: "90%",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                downloadPdfMutation.mutate();
                setIsVisible(false);
              }}
            >
              <Text>Generar codigos QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option}>
              <Text>Generar reporte</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                navigation.navigate("ReceiptScreen", {
                  selling_session_id: id,
                });
                setIsVisible(false);
              }}
            >
              <Text>Ver recibo</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  option: {
    padding: 20,
  },
});
