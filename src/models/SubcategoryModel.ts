import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    ForeignKey,
    BelongsTo,
    Index,
    Unique,
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

    @Index
    @ForeignKey(() => CategoryModelClass)
    @AllowNull(false)
    @Unique('uniq_subcat_per_category')
    @Column
    category_id!: number;

    @BelongsTo(() => CategoryModelClass, "category_id")
    category!: CategoryModel;
}