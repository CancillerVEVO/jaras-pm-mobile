import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductCategory = {
  product_id: number;
  category_id: number;
  name: string;
};

function getProductCategories(id: number) {
  return new Promise<ProductCategory[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `select P.id as product_id,
       PC.category_id,
       C.name
from "Products" P
inner join Product_Categories PC on P.id = PC.product_id
inner join Categories C on PC.category_id = C.id
WHERE P.id = ?;`,
        [id],
        (_, { rows }) => {
          const categories: ProductCategory[] = [];
          for (let i = 0; i < rows.length; i++) {
            categories.push(rows.item(i));
          }
          resolve(categories);
        },
        (tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useProductCategories(id: number) {
  return useQuery({
    queryKey: ["product", id, "categories"],
    queryFn: async () => getProductCategories(id),
  });
}
