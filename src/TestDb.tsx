import { Text } from "react-native";
import { db } from "./db";
import { useQuery } from "@tanstack/react-query";

interface QueryResult {
  id: number;
  description: string;
}


export function TestDb() {
  const query = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const result = await db().execAsync([{ sql: 'SELECT * FROM "Session_Status";', args: [] }], false);
      console.log(JSON.stringify(result, null, 2));

      return result;
    }
  })

    

  return <Text>{JSON.stringify(query.data, null, 2)}</Text>;
}