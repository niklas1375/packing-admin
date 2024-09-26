import { PackingItem } from './packing-item';

export interface PackingCategory {
  name: string;
  content: PackingItem[];
}
