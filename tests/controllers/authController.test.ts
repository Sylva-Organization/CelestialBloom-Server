
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals'
import type { Request, Response } from 'express';
import { setupTestDB, teardownTestDB } from '../setupTestDB_Connection';
import { register } from '../../src/controllers/AuthController.js';
import { UserModel } from '../../src/models/UserModel';

const createMockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn<(code: number) => Response>().mockReturnValue(res);
    res.json = jest.fn<(body: any) => Response>().mockReturnValue(res);
    return res;
};

describe('AuthController', () => {
    beforeAll(async () => {
        await setupTestDB();
        await UserModel.create({
            first_name: 'test register controller',
            last_name: 'Doe',
            email: 'test3@test.com',
            password: 'test123',
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
    });
});