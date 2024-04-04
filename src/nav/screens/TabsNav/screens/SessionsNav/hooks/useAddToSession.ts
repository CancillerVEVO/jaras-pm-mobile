import { useNavigation, } from "@react-navigation/native";
import { CreateProductSchema } from "./useCreateSession";
import { db } from "@/db";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StackNavigationProp } from "@react-navigation/stack";

export const AddToSessionSchema = z.object({
    selling_session_id: z.number(),
    products: CreateProductSchema.array(),
});

export type AddToSessionSchema = z.input<typeof AddToSessionSchema>;

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


export function useAddToSession() {
    const queryClient = useQueryClient();
    const navigation = useNavigation<StackNavigationProp<any>>();

    return useMutation({
        mutationFn: async (data: z.output<typeof AddToSessionSchema>) => {
            const selling_session_id = data.selling_session_id;
            const products = data.products;

            if (products.length) {
                await createSellingSessionProducts(selling_session_id, products);
            }
        },
        onError: (err) => {
            console.error(err);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["session"],
            });
            navigation.goBack();
        }
    });
}