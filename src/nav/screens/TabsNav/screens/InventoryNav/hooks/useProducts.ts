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

function getProducts(categoryId?: number) {
  if (categoryId) {
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
inner join main.Categories C on Product_Categories.category_id = C.id
where C.id = ?`,
          [categoryId],
          (_, { rows }) => {
            console.log(rows.length)
            const products: ProductSummary[] = [];
            for (let i = 0; i < rows.length; i++) {
              products.push(rows.item(i));
            }
            resolve(products);
          },
          (tx, err): boolean | any => {
            reject(err);
          }
        );
      });
    });
  }

  return new Promise<ProductSummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT P.id,
        P.name,
        P.price,
        MIN(C.name) as category, 
        MIN(C.id) as category_id, 
        P.created_at as createdAt
 FROM "Products" P
 INNER JOIN Product_Categories PC ON P.id = PC.product_id
 INNER JOIN Categories C ON PC.category_id = C.id
 GROUP BY P.id, P.name, P.price, P.created_at;`,
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
        }
      );
    });
  });
}

export function useProducts(categoryId?: number) {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: async () => getProducts(categoryId),
  });
}
