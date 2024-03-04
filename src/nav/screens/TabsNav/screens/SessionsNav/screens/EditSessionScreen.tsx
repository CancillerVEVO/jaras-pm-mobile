import { StackScreenProps } from "@react-navigation/stack";
import { useSession } from "../hooks/useSession";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Input } from "@/Components/Input";
import { useForm, Controller } from "react-hook-form";
import { Fragment, useEffect } from "react";
import { Button } from "@/Components/Button";
import { Text } from "@/Components/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditSessionSchema, useEditSession } from "../hooks/useEditSession";
import { useTheme } from "@react-navigation/native";
import { z } from "zod";
import { useProducts } from "../hooks/useProducts";
import { Select, SelectItem } from "@/Components/Select";

export function EditSessionScreen({
  route,
  navigation,
}: StackScreenProps<any>) {
  const theme = useTheme();

  const id = route.params?.id as number;
  const query = useSession(id);
  const mutation = useEditSession(id);

  const productsQuery = useProducts(id);
  const products = productsQuery.data;

  const data = query.data;

  const form = useForm<z.input<typeof EditSessionSchema>>({
    defaultValues: {
      name: data?.name ?? "",
      session_status_id: data?.session_status_id ?? 1,
    },
    resolver: zodResolver(EditSessionSchema),
  });

  const { handleSubmit, control, reset, formState } = form;

  const onSubmit = mutation.mutate;

  useEffect(() => {
    if (query.isFetchedAfterMount) {
      reset({
        name: data?.name ?? "",
        session_status_id: data?.session_status_id ?? 1,
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
        <Text>Sesión no encontrada</Text>
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
            <Select
              label="Estatus"
              value={value}
              onChange={onChange}
            >
              <SelectItem label="Editable" value={1} />
              <SelectItem label="Activada" value={2} />
              <SelectItem label="Finalizada" value={3} />
            </Select>

            {error && <Text style={{ color: "red" }}>{error.message}</Text>}
          </View>
        )}
        name="session_status_id"
      />

      <View
        style={{
          gap: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
            }}
          >
            Productos
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("AddProductToSessionScreen")}
          >
            <Text style={{ color: theme.colors.primary }}>
              Agregar producto
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {products?.map((product, index) => (
            <Fragment key={product.id}>
              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 20,
                    gap: 20,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                    }}
                  >
                    {product.name}
                  </Text>
                  <Text>
                    {product.count} x $ {product.price}
                  </Text>
                  <Text>${product.price * product.count}</Text>
                </View>
              </TouchableOpacity>
              {index !== products.length - 1 ? (
                <View
                  style={{
                    height: 1,
                    backgroundColor: "gray",
                  }}
                />
              ) : null}
            </Fragment>
          ))}
        </View>
      </View>

      {mutation.isError && (
        <Text style={{ color: "red" }}>{mutation.error.message}</Text>
      )}

      {mutation.isSuccess && (
        <Text style={{ color: "green" }}>
          Sessión actualizada correctamente
        </Text>
      )}

      <Button
        onPress={handleSubmit(onSubmit as any)}
        disabled={mutation.isPending || !formState.isDirty}
      >
        Guardar
      </Button>
    </ScrollView>
  );
}
