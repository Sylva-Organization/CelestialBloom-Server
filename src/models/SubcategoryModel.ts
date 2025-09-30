import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import type { SubcategoryAttributes, SubcategoryCreationAttributes } from "../types/subcategory.js";
import type { CategoryModel } from "./CategoryModel.js";
import { CategoryModel as CategoryModelClass } from "./CategoryModel.js";

@Table({
    tableName: "subcategories",
})

export class SubcategoryModel extends Model<SubcategoryAttributes, SubcategoryCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column({ unique: true })
    name!: string;

    @ForeignKey(() => CategoryModelClass)
    @AllowNull(false)
    @Column
    category_id!: number;

    @BelongsTo(() => CategoryModelClass, "category_id")
    category!: CategoryModel
}