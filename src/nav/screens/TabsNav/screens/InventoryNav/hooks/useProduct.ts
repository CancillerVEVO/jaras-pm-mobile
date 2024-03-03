import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductDetail = {
  id: number;
  name: string;
  price: number;
};

function getProduct(id: number) {
  return new Promise<ProductDetail | null>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM "Products" WHERE id = ?`,
        [id],
        (_, { rows }) => {
          resolve(rows.length ? rows.item(0) : null);
        },
        (tx, err): boolean | any => {
          reject(err);
        }
      );
    });
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => getProduct(id),
  });
}
