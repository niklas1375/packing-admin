interface CategoryNode {
  name: string;
  content?: CategoryNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

export type { CategoryNode, FlatNode };
