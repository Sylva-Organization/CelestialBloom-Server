export interface SubcategoryAttributes {
    id: number;
    name: string;
    category_id: number;
}

export type SubcategoryCreationAttributes = Omit<SubcategoryAttributes, "id">