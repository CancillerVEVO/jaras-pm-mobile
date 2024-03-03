import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export async function setupDatabase() {
  if (
    !(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite"))
      .exists
  ) {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "SQLite"
    );
  }
  await FileSystem.downloadAsync(
    Asset.fromModule(require("../../dev.sqlite")).uri,
    FileSystem.documentDirectory + "SQLite/db.sqlite"
  );
}
