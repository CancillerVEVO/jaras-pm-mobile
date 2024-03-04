import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductSummary = {
  id: number;
  name: string;
  price: number;
};

function getProducts() {
  return new Promise<ProductSummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM "Products"`,
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

export function useAvailableProducts(exclude: number[]) {
  return useQuery({
    queryKey: ["products", exclude],
    queryFn: async () => {
      const products = await getProducts();
      return products.filter((product) => !exclude.includes(product.id));
    },
  });
}
