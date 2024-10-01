import { PackingItem } from "./packing-item";

export interface PackingList {
    id: string;
    name: string;
    type: string;
    updated_at: string;
    packingItems?: PackingItem[]
}