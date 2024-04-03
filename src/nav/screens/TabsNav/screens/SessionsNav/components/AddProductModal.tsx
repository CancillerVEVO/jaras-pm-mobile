import { Text } from "@/Components/Text";
import {
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useAvailableProducts,
  ProductSummary,
} from "../hooks/useAvailableProducts";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { Input } from "@/Components/Input";

const keyExtractor = (item: ProductSummary) => item.id.toString();

export type AddData = {
  quantity: number;
  product: ProductSummary;
};

export function AddProductModal({
  isVisible,
  onClose,
  onAdd,
  exclude,
}: {
  isVisible: boolean;
  onClose: () => void;
  onAdd: (data: AddData) => void;
  exclude: number[];
}) {
  const theme = useTheme();
  const query = useAvailableProducts(exclude);
  const data = query.data ?? [];

  const [quantity, setQuantity] = useState("1");

  useEffect(() => {
    setQuantity("1");
  }, [isVisible]);

  const renderItem: ListRenderItem<ProductSummary> = useCallback(
    ({ item }) => {
      const onPress = () => {
        const q = parseInt(quantity, 10);

        if (Number.isNaN(q) || q <= 0) {
          return;
        }

        onAdd({
          quantity: q,
          product: item,
        });
      };

      return (
        <TouchableOpacity onPress={onPress}>
          <View
            style={{
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>{item.name}</Text>
              <Text>$ {item.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [onAdd, quantity],
  );

  return (
    <Modal
      visible={isVisible}
      animationType="none"
      transparent
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{
            backgroundColor: theme.colors.card,
            borderRadius: 10,
            width: "90%",
            height: "50%",
            overflow: "hidden",
          }}
        >
          <FlatList
            style={{
              flex: 1,
            }}
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparator}
            ListHeaderComponent={
              <ListHeader quantity={quantity} setQuantity={setQuantity} />
            }
            ListEmptyComponent={ListEmpty}
            keyboardShouldPersistTaps="handled"
            stickyHeaderIndices={[0]}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function ListEmpty() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <Text style={{ color: "gray" }}>No hay productos disponibles</Text>
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
    <View
      style={{
        backgroundColor: theme.colors.card,
      }}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          gap: 10,
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Agregar producto
        </Text>

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
