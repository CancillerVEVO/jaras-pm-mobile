import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductSummary = {
  id: number;
  name: string;
  price: number;
  category: string;
  category_id: number;
  createdAt: string;
};

function getProducts() {
  return new Promise<ProductSummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `select P.id,
       P.name,
       P.price,
       C.name as category,
       C.id as category_id,
       P.created_at as createdAt
from "Products" P
inner join Product_Categories on P.id = Product_Categories.product_id
inner join main.Categories C on Product_Categories.category_id = C.id`,
        [],
        (_, { rows }) => {
          const products: ProductSummary[] = [];
          for (let i = 0; i < rows.length; i++) {
            products.push(rows.item(i));
          }
          resolve(products);
        },
        (tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => getProducts(),
  });
}
