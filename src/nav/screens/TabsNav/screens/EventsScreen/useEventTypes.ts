import {db} from "@/db";
import { useQuery } from "@tanstack/react-query";

type EventType = {
    id: number;
    name: string;
    color: string;
};

function getEventTypes() {
    return new Promise<EventType[]>((resolve, reject) => {
        db().readTransaction((tx) => {
            tx.executeSql(
                `SELECT * FROM Event_Type`,
                [],
                (_, { rows }) => {
                    const data: EventType[] = [];
                    for (let i = 0; i < rows.length; i++) {
                        data.push(rows.item(i));
                    }
                    resolve(data);
                },
                (tx, err): boolean | any => {
                    reject(err);
                },
            );
        });
    });
}

export function useEventTypes() {
    return useQuery({
        queryKey: ["eventTypes"],
        queryFn: async () => getEventTypes(),
    });
}