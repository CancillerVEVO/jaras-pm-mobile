import { StackScreenProps } from "@react-navigation/stack";
import { ListRenderItem, View, Pressable, FlatList } from "react-native";
import { Text } from "@/Components/Text";
import {
  useAvailableProducts,
  ProductSummary,
} from "../../hooks/useAvailableProducts";
import { useState } from "react";
import { Input } from "@/Components/Input";
import { useTheme } from "@react-navigation/native";
import {
  AddToSessionSchema,
  useAddToSession,
} from "../../hooks/useAddToSession";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/Button";

const keyExtractor = (item: ProductSummary) => item.id.toString();

export function AddToSessionScreen({
  route,
  navigation,
}: StackScreenProps<any>) {
  const theme = useTheme();
  const selling_session_id = route.params?.selling_session_id as number;
  const exclude = route.params?.exclude as number[];
  const query = useAvailableProducts(exclude);
  const data = query.data ?? [];

  const mutation = useAddToSession();

  const form = useForm<z.input<typeof AddToSessionSchema>>({
    defaultValues: {
      selling_session_id,
      products: [],
    },
    resolver: zodResolver(AddToSessionSchema),
  });

  const { handleSubmit, control } = form;

  const [quantity, setQuantity] = useState("1");
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(
    null
  );

  const renderItem: ListRenderItem<ProductSummary> = ({ item }) => {
    const onPress = () => {
      const q = parseInt(quantity, 10);

      if (Number.isNaN(q) || q <= 0) {
        return;
      }

      setSelectedProduct(item);
    };

    return (
      <Pressable
        onPress={onPress}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          backgroundColor:
            selectedProduct && selectedProduct.id === item.id
              ? "lightgray"
              : "transparent",
        }}
      >
        <Text>{item.name}</Text>
        <Text>{item.price}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{}}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={
          <ListHeader quantity={quantity} setQuantity={setQuantity} />
        }
      />

      <View
        style={{
          padding: 20,
        }}
      >
        
        <Button
            onPress={handleSubmit((data) => {
                mutation.mutate({
                    selling_session_id: data.selling_session_id,
                    products: [
                        {
                            product_id: selectedProduct!.id,
                            name: selectedProduct!.name,
                            price: selectedProduct!.price,
                            quantity: parseInt(quantity, 10),
                        },
                    ],
                
                });
            }
            )}
            disabled={mutation.isPending}
        >
            Agregar producto
        </Button>


        {mutation.error ? (
          <Text style={{ color: "red" }}>{mutation.error.message}</Text>
        ) : null}

        {mutation.isSuccess ? (
          <Text style={{ color: theme.colors.primary }}>
            Producto agregado a la sesión
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function ItemSeparator() {
  return (
    <View
      style={{ height: 1, backgroundColor: "gray", marginHorizontal: 20 }}
    />
  );
}

function ListHeader({
  quantity,
  setQuantity,
}: {
  quantity: string;
  setQuantity: (quantity: string) => void;
}) {
  const theme = useTheme();

  return (
    <View>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          gap: 10,
        }}
      >
        <Input
          label="Cantidad"
          keyboardType="numeric"
          placeholder="Cantidad"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <View>
          <Text style={{ fontWeight: "600" }}>Nombre</Text>
        </View>
        <View>
          <Text style={{ fontWeight: "600" }}>Precio</Text>
        </View>
      </View>

      <ItemSeparator />
    </View>
  );
}
