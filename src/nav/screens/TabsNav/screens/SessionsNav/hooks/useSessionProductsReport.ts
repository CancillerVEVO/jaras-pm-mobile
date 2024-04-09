import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type SessionProductReport = {
    product_id: number;
    name: string;
    price: number;
    total_in_session: number;
    sold_count : number;
    not_sold_count: number; 
};

function getSessionProductsReport(selling_session_id: number) {
    return new Promise<SessionProductReport[]>((resolve, reject) => {
        db().readTransaction((tx) => {
            tx.executeSql(`
            SELECT
            p.id AS product_id,
            p.name AS name,
            p.price AS price,
            COUNT(ssp.product_id) AS total_in_session,
            COUNT(sps.id) AS sold_count,
            (COUNT(ssp.product_id) - COUNT(sps.id)) AS not_sold_count
        FROM
            Products p
        JOIN
            Selling_Session_Products ssp ON p.id = ssp.product_id
        LEFT JOIN
            Session_Product_Sales sps ON ssp.id = sps.selling_session_product_id
        WHERE
            ssp.selling_session_id = ?
        GROUP BY
            p.id, p.name;`, 
            [selling_session_id],
            (_, { rows }) => {
                const products: SessionProductReport[] = [];
                for (let i = 0; i < rows.length; i++) {
                    products.push(rows.item(i));
                }
                resolve(products);
            }, (_tx, err): boolean | any => {
                reject(err);
            });
        });
    });
}

export function useSessionProductsReport(selling_session_id: number) {
    return useQuery({
        queryKey: ["session", selling_session_id, "products_report"],
        queryFn: () => getSessionProductsReport(selling_session_id),
    });
}
