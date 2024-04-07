import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type ItemType = {
  id: number;
  event_type_id: number;
  description: string;
  created_at: string;
};

function getEvents() {
  return new Promise<ItemType[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Events ORDER BY id DESC;`,
        [],
        (_, { rows }) => {
          const data: ItemType[] = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          resolve(data);
        },
        (tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}


export function useEvents() {
  const queryResult = useQuery<ItemType[], Error>({
    queryKey: ["events"],
    queryFn: async () => getEvents(),
  });

  const refetch = async () => {
    try {
      await queryResult.refetch();
    } catch (error) {
      // Manejar el error si es necesario
      console.error("Error al volver a cargar los eventos:", error);
    }
  };

  return { ...queryResult, refetch };
}