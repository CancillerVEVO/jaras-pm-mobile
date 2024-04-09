import { Platform} from "react-native";
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

// Función para convertir un objeto en formato CSV
export function convertToCSV<T extends object>(data: T[]): string {
  const header = Object.keys(data[0]).join(",") + "\n";
  const body = data.map((obj) => Object.values(obj).join(",")).join("\n");
  return header + body;
}


export async function downloadCSV(csv: string, filename: string) {
  const path = `${FileSystem.documentDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(path, csv);
  if (Platform.OS === 'ios') {
    Sharing.shareAsync(path);
  } else {
    Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Descargar reporte' });
  }
}

