import { ScrollView, View } from "react-native";
import { Input } from "@/components/Input";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProductSchema,
  useCreateProduct,
} from "../hooks/useCreateProduct";

export function CreateProductScreen() {
  const mutation = useCreateProduct();

  const form = useForm({
    defaultValues: {
      name: "",
      price: "",
    },
    resolver: zodResolver(CreateProductSchema),
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = mutation.mutate;

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

      <Button
        onPress={handleSubmit(onSubmit as any)}
        disabled={mutation.isPending || !formState.isDirty}
      >
        Crear
      </Button>
    </ScrollView>
  );
}
