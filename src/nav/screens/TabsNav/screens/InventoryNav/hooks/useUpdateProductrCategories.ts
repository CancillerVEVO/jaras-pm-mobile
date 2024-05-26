import { db } from "@/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function updateProductCategories({productId, categoryIds}: {productId: number, categoryIds: number[]}) {
    return new Promise<void>((resolve, reject) => {
      db().transaction((tx) => {
        // Primero, eliminamos todas las categorías actuales del producto
        tx.executeSql(
          `DELETE FROM Product_Categories WHERE product_id = ?`,
          [productId],
          () => {
            // Luego, insertamos las nuevas categorías
            categoryIds.forEach((categoryId) => {
              tx.executeSql(
                `INSERT INTO Product_Categories (product_id, category_id) VALUES (?, ?)`,
                [productId, categoryId]
              );
            });
          },
        );
      },
      (err) => reject(err),
      () => resolve());
    });
  }



 export function useUpdateProductCategories() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: updateProductCategories,
      onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["productCategories"],
            });
            queryClient.invalidateQueries({
              queryKey: ["products"],
            });
      },
    });
  }