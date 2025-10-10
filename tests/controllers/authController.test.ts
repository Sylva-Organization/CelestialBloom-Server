
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
import type { Request, Response } from 'express';
import { setupTestDB, teardownTestDB } from '../setupTestDB_Connection';
import { register, login } from '../../src/controllers/AuthController.js';
import { UserModel } from '../../src/models/UserModel';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

const createMockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn<(code: number) => Response>().mockReturnValue(res);
    res.json = jest.fn<(body: any) => Response>().mockReturnValue(res);
    return res;
};

describe('AuthController', () => {
    beforeAll(async () => {
        await setupTestDB();
        const hashedPassword = await bcrypt.hash('test123', 10);
        await UserModel.create({
            first_name: 'test register controller',
            last_name: 'Doe',
            email: 'test3@test.com',
            password: hashedPassword,
            nick_name: 'teste3',
        });
    });
    afterAll(async () => {
        await teardownTestDB();
    });

    describe('register', () => {
        it.each([
            [{ first_name: '', last_name: 'Doe', email: 'test@test.com', password: 'test123', nick_name: 'teste' }],
            [{ first_name: 'Test', last_name: '', email: 'test@test.com', password: 'test123', nick_name: 'teste' }],
            [{ first_name: 'Test', last_name: 'Doe', email: '', password: 'test123', nick_name: 'teste' }],
            [{ first_name: 'Test', last_name: 'Doe', email: 'test@test.com', password: '', nick_name: 'teste' }],
            [{ first_name: 'Test', last_name: 'Doe', email: 'test@test.com', password: 'test123', nick_name: '' }]
        ])('register >> should respond 400 if any required field is missing', async (partBody) => {
            const req = { body: partBody } as unknown as Request;
            const res = createMockResponse();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
        });

        it('register >> should respond 201 and return user and token', async () => {
            const req = {
                body: {
                    first_name: 'Test',
                    last_name: 'Doe',
                    email: 'test2@test.com',
                    password: 'test123',
                    nick_name: 'test2'
                }
            } as unknown as Request;
            const res = createMockResponse();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        email: 'test2@test.com',
                        nick_name: 'test2'
                    }),
                    token: expect.any(String)
                })
            );
        });

        it('register >> should respond 400 if email already exists', async () => {
            const userBD = await UserModel.findOne();
            const req = {
                body: {
                    first_name: 'test existing user',
                    last_name: 'Doe',
                    email: userBD!.email,
                    password: 'test123',
                    nick_name: 'existing user',
                }
            } as unknown as Request;

            const res = createMockResponse();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Email or nickname already exists" }));
        });

        it('register >> should respond 400 if nickname already exists', async () => {
            const userBD = await UserModel.findOne();
            const req = {
                body: {
                    first_name: 'test existing user',
                    last_name: 'Doe',
                    email: 'test@test.com',
                    password: 'test123',
                    nick_name: userBD!.nick_name,
                }
            } as unknown as Request;

            const res = createMockResponse();

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Email or nickname already exists" }));
        });

        it('register >> should respond 500 when a execption ocurrs', async () => {
            const req = {
                body: {
                    first_name: 'test existing user',
                    last_name: 'Doe',
                    email: 'test@test.com',
                    password: 'test123',
                    nick_name: 'test123',
                }
            } as unknown as Request;
            const res = createMockResponse();

            const original: typeof UserModel.findByPk = UserModel.findByPk;

            UserModel.findByPk = async () => {
                throw new Error('Database error');
            }

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

            UserModel.findByPk = original;
        });
    });

    describe('login', () => {
        it.each([
            [{ identifier: '', password: 'test123' }],
            [{ identifier: 'test@test.com', password: '' }]
        ])('login >> should respond 400 if identifier or password are missisng', async (partBody) => {
            const req = { body: partBody } as unknown as Request;
            const res = createMockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "identifier and password are required" });
        });

        it('login >> should respond 401 when the credentials are invalid', async () => {
            const req = { body: { identifier: 'notexist@test.com', password: 'test123' } } as unknown as Request;
            const res = createMockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
        });

        it('login >> should respond 200 when the credentials are valid', async () => {
            const req = { body: { identifier: 'test3@test.com', password: 'test123' } } as unknown as Request;
            const res = createMockResponse();

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});