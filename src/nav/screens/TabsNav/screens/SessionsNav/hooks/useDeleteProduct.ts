import { db } from "@/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function deleteProduct(id: number) {
  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `delete from Selling_Session_Products where id = ?`,
        [id],
        (_, { rowsAffected }) => {
          rowsAffected
            ? resolve()
            : reject(new Error("No se pudo eliminar el producto"));
        },
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useDeleteProduct(params: {
  selling_session_id: number;
  product_id: number;
  id: number;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => deleteProduct(params.id),
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["session", params.selling_session_id],
      });
    },
  });
}
