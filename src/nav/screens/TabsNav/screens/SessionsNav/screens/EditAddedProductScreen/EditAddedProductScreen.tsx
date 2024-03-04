import { StackScreenProps } from "@react-navigation/stack";
import { EditProductSchema } from "../../hooks/useEditSession";
import { z } from "zod";
import { ScrollView } from "react-native";
import { Text } from "@/Components/Text";
import { Input } from "@/Components/Input";
import { useState } from "react";
import { Button } from "@/Components/Button";

export function EditAddedProductScreen({
  route,
  navigation,
}: StackScreenProps<any>) {
  const onEdit = route.params?.onEdit as (
    product: z.input<typeof EditProductSchema>
  ) => void;
  const data = route.params?.product as z.input<typeof EditProductSchema>;

  const [quantity, setQuantity] = useState(data.quantity);

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={{
          fontWeight: "600",
        }}
      >
        {data.name}
      </Text>

      <Input
        label="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        autoFocus
      />

      <Button
        onPress={() => {
          const q = parseInt(quantity, 10);

          if (Number.isNaN(q) || q <= 0) {
            return;
          }

          onEdit({ ...data, quantity: q.toString() });
          navigation.goBack();
        }}
      >
        Guardar
      </Button>
    </ScrollView>
  );
}
