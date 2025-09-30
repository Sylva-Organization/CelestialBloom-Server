export interface PostAttributes {
    id: number;
    title: string;
    content: string;
    image: string;
    author_id: number;
}

export type PostCreationAttributes = {
    title: string;
    content: string;
    image: string;
    author_id: number;
};
