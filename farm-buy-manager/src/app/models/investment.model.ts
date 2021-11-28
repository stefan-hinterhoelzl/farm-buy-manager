import { Timestamp } from "@firebase/firestore";

export interface Investment {
    item: string;
    price: number;
    createdAt: Timestamp
    createdBy: string;
    points: number;
    bought: boolean;
    uid: string;
}

export interface Ranking {
    item: string,
    points: number,
    itemname: string,
    user: string,
}