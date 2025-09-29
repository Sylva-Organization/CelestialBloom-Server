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
import type { PostAttributes, PostCreationAttributes } from "../types/post.js";
import type { UserModel } from './UserModel.js';
import { UserModel as UserModelClass } from './UserModel.js';

@Table({
    tableName: "posts",
    timestamps: true,
})
export class PostModel extends Model<PostAttributes, PostCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    title!: string;

    @AllowNull(false)
    @Column
    content!: string;

    @AllowNull(false)
    @Column
    image!: string;

    @ForeignKey(() => UserModelClass)
    @AllowNull(false)
    @Column
    author_id!: number;

    @BelongsTo(() => UserModelClass, "author_id")
    author!: UserModel;
}
