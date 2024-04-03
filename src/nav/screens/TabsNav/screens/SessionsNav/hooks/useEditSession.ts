import { db } from "@/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const EditProductSchema = z.object({
  product_id: z.number(),
  quantity: z.number().int(),
  name: z.string(),
  price: z.number(),
});

export type EditProductSchema = z.input<typeof EditProductSchema>;

export const EditSessionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  session_status_id: z.number(),
  products: EditProductSchema.array(),
});

export type EditSessionSchema = z.input<typeof EditSessionSchema>;

function editSession(id: number, data: z.output<typeof EditSessionSchema>) {
  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `UPDATE "Selling_Session" as p SET name = ?, session_status_id = ? WHERE p.id = ?`,
        [data.name, data.session_status_id, id],
        (_, { rowsAffected }) => {
          rowsAffected
            ? resolve()
            : reject(new Error("No se pudo editar la sesión"));
        },
        (_tx, err): boolean | any => {
          reject(err);
        },
      );

      // tx.executeSql(
      //   `DELETE FROM "Selling_Session_Products" WHERE selling_session_id = ?`,
      //   [id],
      //   () => {
      //     const values = data.products.map((product) => [
      //       id,
      //       product.product_id,
      //       product.quantity,
      //     ]);
      //
      //     tx.executeSql(
      //       `INSERT INTO "Selling_Session_Products" (selling_session_id, product_id, quantity) VALUES ${values
      //         .map(() => "(?, ?, ?)")
      //         .join(", ")}`,
      //       values.flat(),
      //       (_, { rowsAffected }) => {
      //         rowsAffected
      //           ? resolve()
      //           : reject(new Error("No se pudieron guardar los productos"));
      //       },
      //       (_tx, err): boolean | any => {
      //         reject(err);
      //       },
      //     );
      //   },
      //   (_tx, err): boolean | any => {
      //     reject(err);
      //   },
      // );
    });
  });
}

export function useEditSession(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.output<typeof EditSessionSchema>) =>
      editSession(id, data),
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["session", id],
      });
    },
  });
}
