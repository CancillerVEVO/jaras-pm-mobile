import { Text } from "@/Components/Text";
import { useTheme } from "@react-navigation/native";
import { Controller, UseFieldArrayProps, useFieldArray } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import {
  CreateProductSchema,
  CreateSessionSchema,
} from "../../hooks/useCreateSession";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import { AddData, AddProductModal } from "../../components/AddProductModal";

export function Products({
  controllerProps,
}: {
  controllerProps: UseFieldArrayProps<CreateSessionSchema, "products">;
}) {
  const { fields, append, remove } = useFieldArray(controllerProps);
  const theme = useTheme();

  const [isVisible, setIsVisible] = useState(false);

  const onPressAdd = () => {
    setIsVisible(true);
  };
  const onPressEdit = () => {};

  const onAdd = useCallback(
    ({ product, quantity }: AddData) => {
      append({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });

      setIsVisible(false);
    },
    [append],
  );

  const total = useMemo(() => {
    return fields.reduce((acc, { price, quantity }) => {
      return acc + quantity * price;
    }, 0);
  }, [fields]);

  const exclude = useMemo(() => {
    return fields.map((product) => product.product_id);
  }, [fields]);

  return (
    <>
      <View
        style={{
          gap: 10,
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

          <TouchableOpacity onPress={() => onPressAdd()}>
            <Text style={{ color: theme.colors.primary }}>
              Agregar producto
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {!fields.length ? (
            <Text style={{ color: "gray" }}>No se han agregado productos</Text>
          ) : null}

          {fields.map((field, index) => {
            return (
              <Controller
                key={field.id}
                control={controllerProps.control}
                name={`products.${index}`}
                render={({ field: { value } }) => {
                  const product = value as CreateProductSchema;

                  return (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 20,
                        }}
                      >
                        <TouchableOpacity onPress={() => remove(index)}>
                          <AntDesign name="closecircle" size={24} color="red" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            paddingVertical: 20,
                            gap: 20,
                          }}
                          onPress={() => onPressEdit()}
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
                        </TouchableOpacity>
                      </View>

                      <View
                        style={{
                          height: 1,
                          backgroundColor: "gray",
                        }}
                      />
                    </View>
                  );
                }}
              />
            );
          })}

          {fields.length ? (
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
          ) : null}
        </View>
      </View>

      <AddProductModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onAdd={onAdd}
        exclude={exclude}
      />
    </>
  );
}
