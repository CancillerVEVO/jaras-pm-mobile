import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

type ProductReport = {
  product_id: number;
  name: string;
  category: string;
  price: number;
  used_in_sessions: number;
  sold_count: number;
  money_generated: number;
  created_at: string;
};

function getProductsReport(categoryId?: number) {
  if (categoryId) {
    return new Promise<ProductReport[]>((resolve, reject) => {
      db().readTransaction((tx) => {
        tx.executeSql(
          `
          SELECT
          p.id AS product_id,
          p.name,
          C.name as category,
          p.price,
          COUNT(ssp.id) AS used_in_session,
          COUNT(sps.id) AS copies_sold,
          COALESCE(SUM(sps.sale_price), 0) AS money_generated,
          p.created_at
      FROM
          Products p
      LEFT JOIN
          Selling_Session_Products ssp ON p.id = ssp.product_id
      LEFT JOIN
          Session_Product_Sales sps ON ssp.id = sps.selling_session_product_id
      INNER JOIN Product_Categories pc ON p.id = pc.product_id
      INNER JOIN Categories C on pc.category_id = C.id
      WHERE C.id = ?
      GROUP BY
          p.id, p.name, p.price, p.created_at;
              
              `,
          [categoryId],
          (_, { rows }) => {
            const products: ProductReport[] = [];
            for (let i = 0; i < rows.length; i++) {
              products.push(rows.item(i));
            }
            resolve(products);
          },
          (_tx, err): boolean | any => {
            reject(err);
          }
        );
      });
    });
  }

  return new Promise<ProductReport[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `
        SELECT
        p.id AS product_id,
        p.name,
        C.name as category,
        p.price,
        COUNT(ssp.id) AS used_in_session,
        COUNT(sps.id) AS copies_sold,
        COALESCE(SUM(sps.sale_price), 0) AS money_generated,
        p.created_at
    FROM
        Products p
    LEFT JOIN
        Selling_Session_Products ssp ON p.id = ssp.product_id
    LEFT JOIN
        Session_Product_Sales sps ON ssp.id = sps.selling_session_product_id
    INNER JOIN Product_Categories pc ON p.id = pc.product_id
    INNER JOIN Categories C on pc.category_id = C.id
    GROUP BY
        p.id, p.name, p.price, p.created_at;
            `,
        [],
        (_, { rows }) => {
          const products: ProductReport[] = [];
          for (let i = 0; i < rows.length; i++) {
            products.push(rows.item(i));
          }
          resolve(products);
        },
        (_tx, err): boolean | any => {
          reject(err);
        }
      );
    });
  });
}

export function useProductsReport(categoryId?: number) {
  return useQuery({
    queryKey: ["products", "report", categoryId],
    queryFn: () => getProductsReport(categoryId),
  });
}
