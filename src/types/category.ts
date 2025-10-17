export interface CategoryAttributes {
    id: number;
    name: string;
}

export type CategoryCreationAttributes = Omit<CategoryAttributes, "id">;
