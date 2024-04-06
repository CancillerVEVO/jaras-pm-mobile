import { db } from "@/db";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { shareAsync } from "expo-sharing";
import * as Print from "expo-print";

const url = "http://192.168.68.117:3000/qr";

type Product = {
  selling_session_product_id: number;
  selling_session_id: number;
  product_name: string;
  price: number;
};

async function getProducts(id: number) {
  return new Promise<Product[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT
    ssp.id as selling_session_product_id,
    ssp.selling_session_id as selling_session_id,
    p.name AS product_name,
    p.price
FROM
    Selling_Session_Products ssp
JOIN
    Products p ON ssp.product_id = p.id
WHERE
    ssp.selling_session_id = ?;
`,
        [id],
        (_, { rows }) => {
          const products: Product[] = [];
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

export function useDownloadPdf(id: number) {
  return useMutation({
    mutationFn: async () => {
      const products = await getProducts(id);

      const res = await axios.post(url, {
        products,
      });

      const html = res.data;

      const { uri } = await Print.printToFileAsync({ html });

      await shareAsync(uri, {
        UTI: "pdf",
        mimeType: "application/pdf",
      });
    },
  });
}
