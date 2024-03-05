import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type appConfig = {
  id: number;
  sheet_url: string;
};

function getConfig() {
  return new Promise<appConfig[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT id, sheet_url FROM "Sheets_Config" LIMIT 1;`,
        [],
        (_, { rows }) => {
          const settings: appConfig[] = [];
          for (let i = 0; i < rows.length; i++) {
            settings.push(rows.item(i));
          }
          resolve(settings);
        },
        (tx, err): boolean | any => {
          reject(err);
        }
      );
    });
  });
}

export function useConfig() {
  return useQuery({
    queryKey: ["config"],
    queryFn: async () => getConfig(),
  });
}
