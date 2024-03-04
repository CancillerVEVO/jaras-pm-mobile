import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type SessionDetail = {
  id: number;
  name: string;
  session_status_id: number;
  created_at: string;
};

function getSession(id: number) {
  return new Promise<SessionDetail | null>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM "Selling_Session" WHERE id = ?`,
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

export function useSession(id: number) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: async () => getSession(id),
  });
}
