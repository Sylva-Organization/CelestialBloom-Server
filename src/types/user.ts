export interface UserAttributes {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
    nick_name: string
}

export type UserCreationAttributes = Omit<UserAttributes, "id" | "role">;
