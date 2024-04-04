import { db } from "@/db";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";

type Data = {
  selling_session_product_id: number;
  selling_session_id: number;
  product_name: string;
  price: number;
};

function productExists({
  selling_session_id,
  selling_session_product_id,
}: {
  selling_session_product_id: number;
  selling_session_id: number;
}) {
  return new Promise<boolean>((resolve, reject) => {
    db().readTransaction((tx) => {
      tx.executeSql(
        `select selling_session_id,selling_session_product_id from Session_Product_Sales
where selling_session_id = ? AND selling_session_product_id = ?`,
        [selling_session_id, selling_session_product_id],
        (_, { rows }) => {
          resolve(!!rows.length);
        },
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

function markSold(data: Data) {
  return new Promise<void>((resolve, reject) => {
    db().transaction((tx) => {
      tx.executeSql(
        ` insert into Session_Product_Sales
(selling_session_id, selling_session_product_id, product_name, sale_price)
VALUES (
        ?, ?, ?, ?
       )`,
        [
          data.selling_session_id,
          data.selling_session_product_id,
          data.product_name,
          data.price,
        ],
        (_, { insertId }) =>
          insertId
            ? resolve()
            : reject(new Error("No se pudo crear la sesión")),
        (_tx, err): boolean | any => {
          reject(err);
        },
      );
    });
  });
}

export function ScannerScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const id = useRef<number | null>(null);

  const queryClient = useQueryClient();

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: async (codes) => {
      const code = codes[0];

      if (!code.value) {
        return;
      }

      const data = JSON.parse(code.value) as Data;

      if (data.selling_session_product_id === id.current) {
        return;
      }

      id.current = data.selling_session_product_id;

      const exists = await productExists(data);

      if (exists) {
        Alert.alert("Producto ya vendido", "Este producto ya esta vendido");
      } else {
        Alert.alert(
          "Marcar producto como vendido",
          `¿Quieres marcar el producto "${data.product_name}" como vendido?`,
          [
            {
              text: "No",
              style: "cancel",
              onPress: () => {
                id.current = null;
              },
            },
            {
              text: "Si",
              onPress: async () => {
                await markSold(data);

                queryClient.invalidateQueries({
                  queryKey: ["session", data.selling_session_id],
                });
              },
            },
          ],
        );
      }
    },
  });

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  if (device == null) {
    return null;
  }

  if (!hasPermission) {
    return null;
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
}
