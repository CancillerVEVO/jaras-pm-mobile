import { StackScreenProps } from "@react-navigation/stack";
import { SessionDetail, useSession } from "../hooks/useSession";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { Input } from "@/Components/Input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import React, { Fragment, useEffect, useMemo } from "react";
import { Button } from "@/Components/Button";
import { Text } from "@/Components/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProductSchema,
  EditSessionSchema,
  useEditSession,
} from "../hooks/useEditSession";
import { useTheme } from "@react-navigation/native";
import { z } from "zod";
import { Select, SelectItem } from "@/Components/Select";
import { AntDesign } from "@expo/vector-icons";

function getDefaultValues(
  data: SessionDetail | undefined | null
): z.input<typeof EditSessionSchema> {
  return {
    name: data?.name ?? "",
    session_status_id: data?.session_status_id ?? 1,
    products: data?.products
      ? data.products.map((product) => ({
          ...product,
          quantity: product.quantity.toString(),
        }))
      : [],
  };
}

export function EditSessionScreen({
  route,
  navigation,
}: StackScreenProps<any>) {
  const theme = useTheme();

  const id = route.params?.id as number;
  const query = useSession(id);
  const mutation = useEditSession(id);

  const data = query.data;

  const form = useForm<z.input<typeof EditSessionSchema>>({
    defaultValues: getDefaultValues(data),
    resolver: zodResolver(EditSessionSchema),
  });

  const { handleSubmit, control, reset } = form;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "products",
  });

  const total = useMemo(() => {
    return fields.reduce((acc, { quantity, price }) => {
      return acc + parseInt(quantity, 10) * price;
    }, 0);
  }, [fields]);

  const exclude = useMemo(() => {
    return fields.map((product) => product.product_id);
  }, [fields]);

  const onSubmit = mutation.mutate;

  useEffect(() => {
    if (query.isFetchedAfterMount) {
      reset(getDefaultValues(data));
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
              label="Nombre de la sesión"
              value={value}
              onChangeText={onChange}
              placeholder="Nombre de la sesión"
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
              getLabel={(value) => {
                switch (value) {
                  case 1:
                    return "Editable";
                  case 2:
                    return "Activada";
                  case 3:
                    return "Finalizada";
                }

                return "";
              }}
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
            onPress={() =>
              navigation.navigate("AddProductScreen", {
                exclude,
                onAdd: (product: z.input<typeof EditProductSchema>) =>
                  append(product),
              })
            }
          >
            <Text style={{ color: theme.colors.primary }}>
              Agregar producto
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {fields?.map((product, index) => {
            return (
              <View
                key={product.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Eliminar producto", "¿Estás seguro?", [
                      {
                        text: "Cancelar",
                        style: "cancel",
                        },
                        {
                          text: "Eliminar",
                          style: "destructive",
                          onPress: () => remove(index),
                        },
                      ]);
                  }}
                >
                  <AntDesign name="closecircle" size={24} color="red" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingVertical: 20,
                    gap: 20,
                  }}
                  onPress={() =>
                    navigation.navigate("EditAddedProductScreen", {
                      product,
                      onEdit: (product: z.input<typeof EditProductSchema>) =>
                        update(index, product),
                    })
                  }
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
                    {product.quantity} x $ {product.price}
                  </Text>
                  <Text>
                    $ {parseInt(product.quantity, 10) * product.price}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "gray",
                  }}
                />
              </View>
            );
          })}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
              }}
            >
              Total
            </Text>
            <Text
              style={{
                fontWeight: "600",
              }}
            >
              $ {total}
            </Text>
          </View>
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
        disabled={mutation.isPending}
      >
        Guardar
      </Button>
    </ScrollView>
  );
}
