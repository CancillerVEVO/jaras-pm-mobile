import { db } from "@/db";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const CreateSessionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  session_status_id: z.number(),
});

function createSession(data: z.output<typeof CreateSessionSchema>) {
  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "Selling_Session" (name, session_status_id) VALUES (?, ?)`,
        [data.name, data.session_status_id],
        (_, { rowsAffected }) => {
          rowsAffected
            ? resolve()
            : reject(new Error("No se pudo crear la sesión"));
        },
        (tx, err): boolean | any => {
          reject(err);
        }
      );
    });
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return useMutation({
    mutationFn: async (data: z.output<typeof CreateSessionSchema>) =>
      createSession(data),
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });

      navigation.navigate("SessionsScreen");
    },
  });
}
