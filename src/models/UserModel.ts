import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    DataType,
    HasMany,
    Index
} from "sequelize-typescript";
import type { UserAttributes, UserCreationAttributes } from "../types/user.js";
import type { PostModel } from './PostModel.js';
import { PostModel as PostModelClass } from './PostModel.js';

@Table({
    tableName: "users",
    paranoid: true
})
export class UserModel extends Model<UserAttributes, UserCreationAttributes> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column({
        validate: { notEmpty: true }
    })
    first_name!: string;

    @AllowNull(false)
    @Column({
        validate: { notEmpty: true }
    })
    last_name!: string;

    @Index
    @AllowNull(false)
    @Column({
        validate: { notEmpty: true }
    })
    email!: string;

    @AllowNull(false)
    @Column({
        validate: { notEmpty: true }
    })
    password!: string;

    @Column({
        type: DataType.ENUM('admin', 'user'),
        defaultValue: 'user',
    })
    role!: string;

    @Index
    @AllowNull(false)
    @Column({
        unique: true,
        validate: { notEmpty: true }
    })
    nick_name!: string;


    @HasMany(() => PostModelClass, 'author_id')
    posts!: PostModel[];
}

