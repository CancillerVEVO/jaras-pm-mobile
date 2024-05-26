import { StackScreenProps } from "@react-navigation/stack";
import { useProduct } from "../hooks/useProduct";
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "@/components/Input";
import {
  useForm,
  Controller,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProductSchema, useEditProduct } from "../hooks/useEditProduct";
import {
  ProductCategory,
  useProductCategories,
} from "../hooks/useProductCategories";

export function EditProductScreen({ route }: StackScreenProps<any>) {
  const query = useProduct(route.params?.id as number);
  const mutation = useEditProduct(route.params?.id as number);

  const queryCategories = useProductCategories(route.params?.id as number);
  const categories = queryCategories.data ?? [];

  const data = query.data;

  const form = useForm({
    defaultValues: {
      name: data?.name ?? "",
      price: data?.price ? data.price.toString() : "",
      categories,
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

  if (query.isLoading || queryCategories.isLoading) {
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

      <Categories
        controllerProps={{
          control,
          name: "categories",
        }}
      />

      {mutation.isError && (
        <Text style={{ color: "red" }}>{mutation.error.message}</Text>
      )}

      {mutation.isSuccess && (
        <Text style={{ color: "green" }}>Producto actualizado</Text>
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

function Categories({
  controllerProps,
}: {
  controllerProps: UseControllerProps<any>;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const {
    field: { value },
    formState,
    fieldState,
  } = useController(controllerProps);

  const categories = value as ProductCategory[];
  console.log(categories);

  return (
    <>
      <TouchableOpacity
        style={{
          gap: 10,
        }}
        onPress={() => setIsVisible(true)}
      >
        <Text
          style={{
            fontWeight: "600",
          }}
        >
          Categorias:
        </Text>

        {categories.length ? (
          <Text>{categories.map((c) => c.name).join(", ")}</Text>
        ) : (
          <Text
            style={{
              color: "gray",
            }}
          >
            Seleccionar categorias
          </Text>
        )}

        <View
          style={{
            height: 1,
            backgroundColor: "black",
          }}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        statusBarTranslucent
        animationType="none"
      >
        <Pressable
          onPress={() => setIsVisible(false)}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
              width: "80%",
            }}
          >
            <Text
              style={{
                fontWeight: "600",
              }}
            >
              Categorias
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
