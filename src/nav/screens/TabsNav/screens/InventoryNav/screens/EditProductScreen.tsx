import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useProduct } from "../hooks/useProduct";
import { ScrollView, View } from "react-native";
import { Input } from "@/components/Input";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProductSchema, useEditProduct } from "../hooks/useEditProduct";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

export function EditProductScreen({ route }: StackScreenProps<any>) {
  const query = useProduct(route.params?.id as number);
  const mutation = useEditProduct(route.params?.id as number);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const data = query.data;

  const form = useForm({
    defaultValues: {
      name: data?.name ?? "",
      price: data?.price ? data.price.toString() : "",
    },
    resolver: zodResolver(EditProductSchema),
  });

  const { handleSubmit, control, reset, formState } = form;

  const onSubmit = mutation.mutate;

  useEffect(() => {
    if (query.isFetchedAfterMount) {
      reset({
        name: data?.name ?? "",
        price: data?.price ? data.price.toString() : "",
      });
    }
  }, [query.isFetchedAfterMount, data, reset]);

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
        <Text>Producto no encontrado</Text>
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
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View
            style={{
              gap: 10,
            }}
          >
            <Input
              label="Ponle un nombre a tu producto:"
              value={value}
              onChangeText={onChange}
              placeholder="Nombre del producto"
              autoFocus
            />

            {error && <Text style={{ color: "red" }}>{error.message}</Text>}
          </View>
        )}
        name="name"
      />

      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View
            style={{
              gap: 10,
            }}
          >
            <Input
              label="Ponle un precio:"
              value={value}
              onChangeText={onChange}
              placeholder="Precio"
              keyboardType="numeric"
            />

            {error && <Text style={{ color: "red" }}>{error.message}</Text>}
          </View>
        )}
        name="price"
      />

      {mutation.isError && (
        <Text style={{ color: "red" }}>{mutation.error.message}</Text>
      )}

      {mutation.isSuccess && (
        <Text style={{ color: "green" }}>Producto actualizado</Text>
      )}

      <View>
        <TouchableOpacity
          onPress={
            () => {
              navigation.navigate("ProductCategoryScreen", {id: route.params?.id as number});
            }
          }
        >
          <Text
            style={{
              color: "blue",
              textDecorationLine: "underline",
              fontSize: 16,
            }}
          >
            Editar Categorías
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        onPress={handleSubmit(onSubmit as any)}
        disabled={mutation.isPending || !formState.isDirty}
      >
        Guardar
      </Button>
    </ScrollView>
  );
}
