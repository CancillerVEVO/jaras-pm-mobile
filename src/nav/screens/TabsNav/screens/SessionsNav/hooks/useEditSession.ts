import { db } from "@/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const EditSessionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  session_status_id: z.number(),
});

function editSession(id: number, data: z.output<typeof EditSessionSchema>) {
  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `UPDATE "Selling_Session" as p SET name = ?, session_status_id = ? WHERE p.id = ?`,
        [data.name, data.session_status_id, id],
        (_, { rowsAffected }) => {
          rowsAffected ? resolve() : reject(new Error("No se pudo editar la sesión"));
        },
        (tx, err): boolean | any => {
          reject(err);
        }
      );
    });
  });
}

export function useEditSession(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.output<typeof EditSessionSchema>) =>
      editSession(id, data),
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["session", id],
      });
    },
  });
}
