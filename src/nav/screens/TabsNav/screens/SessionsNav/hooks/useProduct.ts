import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ProductDetail = {
  name: string;
  product_id: number;
  is_sold: number;
  sale_date: string | null;
  selling_session_product_id: number;
  selling_session_id: number;
};

function getProduct({
  selling_session_id,
  id,
}: {
  selling_session_id: number;
  id: number;
}) {
  return new Promise<ProductDetail[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT
    ssp.product_id,
    ssp.selling_session_id,
    ssp.id AS selling_session_product_id,
    p.name AS name,
    CASE
        WHEN sps.id IS NOT NULL THEN true
        ELSE false
    END AS is_sold,
    sps.sale_date
FROM
    Selling_Session_Products ssp
JOIN
    Products p ON ssp.product_id = p.id
LEFT JOIN
    Session_Product_Sales sps ON ssp.id = sps.selling_session_product_id
WHERE
    p.id = ?
  AND
    ssp.selling_session_id = ?;`,
        [id, selling_session_id],
        (_, { rows }) => {
          const data: ProductDetail[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useProduct(params: { selling_session_id: number; id: number }) {
  return useQuery({
    queryKey: ["session", params.selling_session_id, "product", params.id],
    queryFn: () => getProduct(params),
  });
}
