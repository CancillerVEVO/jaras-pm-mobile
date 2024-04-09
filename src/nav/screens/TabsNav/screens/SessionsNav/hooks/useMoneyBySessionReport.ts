import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

type MoneyGeneratedBySessionReport = {
    selling_session_id: number;
    name: string;
    money_generated: number;
    potential_money: number;
    create_date: string;
}


function getMoneyGeneratedBySessionsReport() {
    return new Promise<MoneyGeneratedBySessionReport[]>((resolve, reject) => {
        db().readTransaction((tx) => {
            tx.executeSql(`
            SELECT
    ss.id AS selling_session_id,
    ss.name AS name,
    COALESCE(SUM(sps.sale_price), 0) AS money_generated,
    COALESCE(SUM(p.price), 0) AS potential_money,
    ss.created_at AS create_date
FROM
    Selling_Session ss
LEFT JOIN
    Selling_Session_Products ssp ON ss.id = ssp.selling_session_id
LEFT JOIN
    Products p ON ssp.product_id = p.id
LEFT JOIN
    Session_Product_Sales sps ON ssp.id = sps.selling_session_product_id
GROUP BY
    ss.id, ss.name, ss.created_at;`, 
            [],
            (_, { rows }) => {
                const sessions: MoneyGeneratedBySessionReport[] = [];
                for (let i = 0; i < rows.length; i++) {
                    sessions.push(rows.item(i));
                }
                resolve(sessions);
            }, (_tx, err): boolean | any => {
                reject(err);
            });
        });
    });
}

export function useMoneyGeneratedBySessionsReport() {
    return useQuery({
        queryKey: ["sessions", "money_generated"],
        queryFn: () => getMoneyGeneratedBySessionsReport(),
    });
}