import { db } from "@/db";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z
    .string()
    .min(1, "El precio es requerido")
    .pipe(
      z.coerce.number({
        invalid_type_error: "El precio debe ser un número",
      })
    ),
});

function createProduct(data: z.output<typeof CreateProductSchema>) {
  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "Products" (name, price) VALUES (?, ?)`,
        [data.name, data.price],
        (_, { rowsAffected }) => {
          rowsAffected
            ? resolve()
            : reject(new Error("No se pudo crear el producto"));
        },
        (tx, err): boolean | any => {
          reject(err);
        }
      );
    });
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return useMutation({
    mutationFn: async (data: z.output<typeof CreateProductSchema>) =>
      createProduct(data),
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      navigation.navigate("InventoryScreen");
    },
  });
}
