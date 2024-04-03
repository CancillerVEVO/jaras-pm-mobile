import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type SessionDetail = {
  id: number;
  name: string;
  session_status_id: number;
  created_at: string;
  products: ProductSummary[];
};

export type ProductSummary = {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

function getProducts(selling_session_id: number) {
  return new Promise<ProductSummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `
SELECT
    ssp.product_id,
    p.name,
    COUNT(ssp.product_id) AS quantity,
    p.price AS price,
    COUNT(ssp.product_id) * p.price AS total_price
FROM
    Selling_Session_Products ssp
JOIN
    Products p ON ssp.product_id = p.id
WHERE
    ssp.selling_session_id = ?
GROUP BY
    ssp.product_id, p.name, p.price;
`,
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

function getSession(id: number) {
  return new Promise<SessionDetail | null>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM "Selling_Session" WHERE id = ?`,
        [id],
        (_, { rows }) => {
          resolve(rows.length ? rows.item(0) : null);
        },
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useSession(id: number) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const session = await getSession(id);

      if (session) {
        const products = await getProducts(id);
        return { ...session, products };
      }

      return null;
    },
  });
}
