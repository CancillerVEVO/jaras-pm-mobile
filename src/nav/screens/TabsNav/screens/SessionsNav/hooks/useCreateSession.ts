import { db } from "@/db";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const CreateProductSchema = z.object({
  product_id: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int(),
});

export type CreateProductSchema = z.input<typeof CreateProductSchema>;

export const CreateSessionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  session_status_id: z.number(),
  products: CreateProductSchema.array(),
});

export type CreateSessionSchema = z.input<typeof CreateSessionSchema>;

function createSellingSession({
  name,
  session_status_id,
}: z.output<typeof CreateSessionSchema>): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "Selling_Session" (name, session_status_id) VALUES (?, ?)`,
        [name, session_status_id],
        (_, { insertId }) =>
          insertId
            ? resolve(insertId)
            : reject(new Error("No se pudo crear la sesión")),
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

function createSellingSessionProducts(
  selling_session_id: number,
  products: z.output<typeof CreateProductSchema>[],
) {
  let data: any[] = [];

  for (let i = 0; i < products.length; ++i) {
    const product = products[i];
    for (let j = 0; j < product.quantity; ++j) {
      data.push([selling_session_id, product.product_id]);
    }
  }

  data = data.flat();

  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        `INSERT INTO "Selling_Session_Products" (selling_session_id, product_id) VALUES ${Array.from({ length: data.length }, () => "(?,?)").join()}`,
        data,
        (_, { rowsAffected }) => {
          rowsAffected
            ? resolve()
            : reject(
                new Error("No se pudieron crear los productos de la sesión"),
              );
        },
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  const navigation = useNavigation<StackNavigationProp<any>>();

  return useMutation({
    mutationFn: async (data: z.output<typeof CreateSessionSchema>) => {
      const selling_session_id = await createSellingSession(data);

      if (data.products.length) {
        await createSellingSessionProducts(selling_session_id, data.products);
      }
    },
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
