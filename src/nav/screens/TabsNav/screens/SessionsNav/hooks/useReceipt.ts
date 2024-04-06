import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductSummary = {
  selling_session_product_id: number;
  product_name: string;
  sale_price: number;
  sale_date: string;
};

function getReceipt(selling_session_id: number) {
  return new Promise<ProductSummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT selling_session_product_id, product_name, sale_price, sale_date
FROM Session_Product_Sales
WHERE selling_session_id = ?;`,
        [selling_session_id],
        (_, { rows }) => {
          const products: ProductSummary[] = [];
          for (let i = 0; i < rows.length; i++) {
            products.push(rows.item(i));
          }
          resolve(products);
        },
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useReceipt(selling_session_id: number) {
  return useQuery({
    queryKey: ["session", selling_session_id, "receipt"],
    queryFn: () => getReceipt(selling_session_id),
  });
}
