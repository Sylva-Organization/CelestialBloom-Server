import { afterAll, beforeAll, describe, it, jest } from "@jest/globals";
import type { Request, Response } from "express";
import { setupTestDB, teardownTestDB } from "../setupTestDB_Connection";
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from '../../src/controllers/PostsController.js';
import { PostModel } from "../../src/models/PostModel.js";
import { CategoryModel } from "../../src/models/CategoryModel.js";
import { UserModel } from "../../src/models/UserModel.js";
import bcrypt from 'bcryptjs';

const createMockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn<(code: number) => Response>().mockReturnValue(res);
    res.json = jest.fn<(body: any) => Response>().mockReturnValue(res);
    return res;
};

describe('PostControler', () => {
    beforeAll(async () => {
        await setupTestDB();
    });
    afterAll(async () => {
        await teardownTestDB();
    });

    describe('getAllPosts', () => {
        it('should respond with 200 and return all posts', async () => {
            const req = { query: {} } as unknown as Request;
            const res = createMockResponse();

            await getAllPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
        it("should respond with 500 with an exception occurs", async () => {
            const req = { query: {} } as unknown as Request;
            const res = createMockResponse();
            const original = PostModel.findAndCountAll;
            PostModel.findAndCountAll = async () => { throw new Error('Database error'); };

            await getAllPosts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

            PostModel.findAndCountAll = original;
        });
    });
    describe('getOnePost', () => {
        let createdPost: unknown;

        beforeAll(async () => {
            const hashedPassword = await bcrypt.hash('test123', 10);
            const user = await UserModel.create({
                first_name: 'test post controller get one',
                last_name: 'Doe',
                email: 'test3@test.com',
                password: hashedPassword,
                nick_name: 'teste3',
            });

            const category = await CategoryModel.create({ name: 'Botanica' });

            createdPost = await PostModel.create({
                title: 'Test Post',
                content: 'Test Post content',
                image: 'test.jpg',
                author_id: user.id,
                category_id: category.id,
            });
        });
        it('getOnePost >> should respond with 404 when the post does not exist', async () => {
            const req = { params: { id: '999' } } as unknown as Request<{ id: string }>;
            const res = createMockResponse();

            await getOnePost(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
        });

        it('getOnePost >> should respond with 200 and return the post data when it exists', async () => {
            const post = await PostModel.findOne();
            const req = { params: { id: post!.id?.toString() } } as unknown as Request<{ id: string }>;
            const res = createMockResponse();

            await getOnePost(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        id: post!.id,
                        title: post!.title
                    })
                })
            );
        });

        it('getOnePost >> should respond with 500 when an exception occurs', async () => {
            const req = { params: { id: '1' } } as unknown as Request<{ id: string }>;
            const res = createMockResponse();
            const original = PostModel.findByPk;

            PostModel.findByPk = async () => { throw new Error('Database error'); };

            await getOnePost(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

            PostModel.findByPk = original;
        });
    });
    describe('createPost', () => {
        let user: any;
        let category: any;
        beforeAll(async () => {
            user = await UserModel.create({
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'jane@test.com',
                password: '123456',
                nick_name: 'janedoe',
            });
            category = await CategoryModel.create({ name: 'Astronomia' });
        });

        it('should respond with 201 and return the created post', async () => {
            const req = {
                body: {
                    title: 'New Post',
                    content: 'This is a post',
                    image: 'test.jpg',
                    category_id: category.id
                },
                user: { id: user.id }
            } as unknown as Request;

            const res = createMockResponse();

            await createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: 'New Post',
                        author_id: user.id,
                        category_id: category.id
                    })
                })
            );
        });

        it('should respond with 400 if required fields are missing', async () => {
            const req = {
                body: {},
                user: { id: user.id }
            } as unknown as Request;

            const res = createMockResponse();

            await createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'title, content, image, author_id and category_id are required'
            });
        });

        it('should respond with 400 if author does not exist', async () => {
            const req = {
                body: {
                    title: 'Invalid author post',
                    content: 'text',
                    image: 'image.jpg',
                    category_id: category.id
                },
                user: { id: 9999 } // autor inexistente
            } as unknown as Request;

            const res = createMockResponse();

            await createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Author (author_id) does not exist'
            });
        });

        it('should respond with 400 if category does not exist', async () => {
            const req = {
                body: {
                    title: 'Invalid category post',
                    content: 'text',
                    image: 'image.jpg',
                    category_id: 9999
                },
                user: { id: user.id }
            } as unknown as Request;

            const res = createMockResponse();

            await createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Category (category_id) does not exist'
            });
        });

        it('should respond with 500 if an exception occurs', async () => {
            const req = {
                body: {
                    title: 'Error post',
                    content: 'Error post',
                    image: 'error.jpg',
                    category_id: category.id
                },
                user: { id: user.id }
            } as unknown as Request;

            const res = createMockResponse();
            const original = PostModel.create;

            PostModel.create = async () => { throw new Error('Database error'); };

            await createPost(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

            PostModel.create = original;
        });
    });
    describe('PostController - Update & Delete', () => {
        let user: any;
        let category: any;
        let post: any;

        beforeAll(async () => {
            user = await UserModel.create({
                first_name: 'Test',
                last_name: 'User',
                email: 'test@example.com',
                password: '123',
                nick_name: 'tester'
            });
            category = await CategoryModel.create({ name: 'Testing' });

            post = await PostModel.create({
                title: 'Original Title',
                content: 'Original content',
                image: 'original.jpg',
                author_id: user.id,
                category_id: category.id,
            });
        });
        it('updatePost >> should update a post and return the updated data', async () => {
            const req = {
                params: { id: post.id.toString() },
                body: { title: 'Updated Title' },
                user: { id: user.id }
            } as unknown as Request;
            const res = createMockResponse();

            await updatePost(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ title: 'Updated Title' })
                })
            );
        });

        it('deletePost >> should delete a post and return success message', async () => {
            const req = { params: { id: post.id.toString() } } as unknown as Request;
            const res = createMockResponse();

            await deletePost(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "The post has been deleted successfully!" });

            const deletedPost = await PostModel.findByPk(post.id);
            expect(deletedPost).toBeNull();
        });
    });
});