import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type SessionSummary = {
  id: number;
  name: string;
  session_status_id: number;
  created_at: string;
};

function getSessions() {
  return new Promise<SessionSummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT * FROM "Selling_Session"`,
        [],
        (_, { rows }) => {
          const data: SessionSummary[] = [];
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

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => getSessions(),
  });
}
