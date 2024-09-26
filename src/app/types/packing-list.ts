import { PackingCategory } from './packing-category';

export interface PackingList {
  clothing: PackingCategory;
  toiletries: PackingCategory;
  gear: PackingCategory;
  organisational: PackingCategory;
  entertainment: PackingCategory;
  other: PackingCategory;
}
