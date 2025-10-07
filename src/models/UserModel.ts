import {
    Table,
    Column,
    Model,
    PrimaryKey,
    AutoIncrement,
    AllowNull,
    DataType,
    HasMany
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
    @Column
    first_name!: string;

    @AllowNull(false)
    @Column
    last_name!: string;

    @AllowNull(false)
    @Column
    email!: string;

    @AllowNull(false)
    @Column
    password!: string;

    @Column({
        type: DataType.ENUM('admin', 'user'),
        defaultValue: 'user',
    })
    role!: string;

    @AllowNull(false)
    @Column({unique: true})
    nick_name!: string
    

    @HasMany(() => PostModelClass, 'author_id')
    posts!: PostModel[];
}
