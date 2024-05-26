import { db } from "@/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const EditProductSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z
    .string()
    .min(1, "El precio es requerido")
    .pipe(
      z.coerce.number({
        invalid_type_error: "El precio debe ser un número",
      }),
    ),
  categories: z
    .object({
      product_id: z.number(),
      category_id: z.number(),
      name: z.string(),
    })
    .array(),
});

function editProduct(id: number, data: z.output<typeof EditProductSchema>) {
  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `UPDATE "Products" as p SET name = ?, price = ? WHERE p.id = ?`,
        [data.name, data.price, id],
        (_, { rowsAffected }) => {
          rowsAffected
            ? resolve()
            : reject(new Error("No se pudo editar el producto"));
        },
        (tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useEditProduct(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.output<typeof EditProductSchema>) =>
      editProduct(id, data),
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", id],
      });
    },
  });
}
