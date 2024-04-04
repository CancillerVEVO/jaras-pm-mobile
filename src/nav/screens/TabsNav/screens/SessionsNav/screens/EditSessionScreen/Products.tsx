import { Text } from "@/Components/Text";
import {
  useNavigation,
  useTheme,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { ProductSummary } from "../../hooks/useSession";

export function Products({ products }: { products: ProductSummary[] }) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  const selling_session_id = route.params?.id as number;

  const theme = useTheme();

  const onPressEdit = (product: ProductSummary) => {
    navigation.navigate("EditProductScreen", {
      id: product.product_id,
      name: product.name,
      selling_session_id,
    });
  };

  const onPressAdd = () => {
    navigation.navigate("AddToSessionScreen", {
      selling_session_id,
      exclude
    });
  };

  const total = useMemo(() => {
    return products.reduce((acc, { price, quantity }) => {
      return acc + quantity * price;
    }, 0);
  }, [products]);

  const exclude = useMemo(() => {
    return products.map((product) => product.product_id);
  }, [products]);

  return (
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
          <Text style={{ color: theme.colors.primary }}>Agregar producto</Text>
        </TouchableOpacity>
      </View>

      <View>
        {!products.length ? (
          <Text style={{ color: "gray" }}>No se han agregado productos</Text>
        ) : null}

        {products.map((product) => {
          return (
            <View key={product.product_id}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingVertical: 20,
                    gap: 20,
                  }}
                  onPress={() => onPressEdit(product)}
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
        })}

        {products.length ? (
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
  );
}
