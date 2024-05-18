import { db } from "@/db";
import { useQuery } from "@tanstack/react-query";

export type CategorySummary = {
  id: number;
  name: string;
};

function getCategories() {
  return new Promise<CategorySummary[]>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `SELECT id, name FROM "Categories"`,
        [],
        (_, { rows }) => {
          const categories: CategorySummary[] = [];
          for (let i = 0; i < rows.length; i++) {
            categories.push(rows.item(i));
          }
          resolve(categories);
        },
        (tx, err): boolean | any => {
          reject(err);
        }
      );
    });
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => getCategories(),
  });
}
