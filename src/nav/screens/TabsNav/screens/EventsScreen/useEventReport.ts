import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

type EventReport = {
  event_id: number;
  type: string;
  description: string;
  created_at: string;
};

function getEventReport() {
  return new Promise<EventReport[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `
        SELECT
        e.id AS event_id,
        et.name AS event_type,
        e.description,
        e.created_at
    FROM
        Events e
    JOIN
        Event_Type et ON e.event_type_id = et.id
    ORDER BY e.id ASC;
            `,
        [],
        (_, { rows }) => {
          const products: EventReport[] = [];
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

export function useEventReport() {
  return useQuery({
    queryKey: ["events", "report"],
    queryFn: () => getEventReport(),
  });
}
