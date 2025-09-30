import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    DataType,
    HasMany,
} from "sequelize-typescript";
import type { CategoryAttributes, CategoryCreationAttributes } from "../types/category.js";
import type { PostModel } from "./PostModel.js";
import { PostModel as PostModelClass } from "./PostModel.js";
import { SubcategoryModel } from "./SubcategoryModel.js";
import { SubcategoryModel as SubcategoryModelClass } from "./SubcategoryModel.js";

@Table({
    tableName: "categories"
})

export class CategoryModel extends Model<CategoryAttributes, CategoryCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column({ unique: true })
    name!: string;

    @HasMany(() => PostModelClass)
    posts!: PostModel[];

    @HasMany(() => SubcategoryModelClass)
    subcategories!: SubcategoryModel[];
}