import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductCategory = {
    product_id: number;
    category_id: number;
    name: string;
};

function getProducCategories(id: number) {
    return new Promise<ProductCategory[] | null>((resolve, reject) => {
      db().readTransaction((tx) => {
        tx.executeSql(
          `SELECT P.id as product_id,
          PC.category_id,
          C.name
   FROM "Products" P
   INNER JOIN Product_Categories PC ON P.id = PC.product_id
   INNER JOIN Categories C ON PC.category_id = C.id
   WHERE P.id = ?`,
          [id],
          (_, { rows }) => {
            const productCategories: ProductCategory[] = [];
            for (let i = 0; i < rows.length; i++) {
              productCategories.push(rows.item(i));
            }
            resolve(productCategories);
          },
          (tx, err): boolean | any => {
            reject(err);
          }
        );
      });
    });
  }

export function useProductCategories(id: number) {
  return useQuery({
    queryKey: ["productCategories", id],
    queryFn: async () => getProducCategories(id),
  });
}
