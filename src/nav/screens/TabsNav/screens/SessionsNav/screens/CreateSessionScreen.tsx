import { ScrollView, View } from "react-native";
import { Input } from "@/Components/Input";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/Components/Button";
import { Text } from "@/Components/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSessionSchema,
  useCreateSession,
} from "../hooks/useCreateSession";
import { z } from "zod";

export function CreateSessionScreen() {
  const mutation = useCreateSession();

  const form = useForm<z.input<typeof CreateSessionSchema>>({
    defaultValues: {
      name: "",
      session_status_id: 1,
    },
    resolver: zodResolver(CreateSessionSchema),
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
            {error && <Text style={{ color: "red" }}>{error.message}</Text>}
          </View>
        )}
        name="session_status_id"
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
