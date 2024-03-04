import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductSummary = {
  id: number;
  name: string;
  price: number;
  count: number;
};

function getProducts(selling_session_id: number) {
  return new Promise<ProductSummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT p.id, p.name, p.price, COUNT(p.id) as count from "Products" as p INNER JOIN "Selling_Session_Products" as ssp ON p.id = ssp.product_type_id WHERE ssp.selling_session_id = ? group by p.id`,
        [selling_session_id],
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

export function useProducts(selling_session_id: number) {
  return useQuery({
    queryKey: ["session", selling_session_id, "products"],
    queryFn: async () => getProducts(selling_session_id),
  });
}
