import { describe, it, beforeAll, afterAll, expect, jest } from '@jest/globals';
import type { Request, Response } from 'express';
import { getOneUser } from '../../src/controllers/UsersController.js';
import { setupTestDB, teardownTestDB } from '../setupTestDB_Connection.js';
import { UserModel } from '../../src/models/UserModel.js';

const createMockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn<(code: number) => Response>().mockReturnValue(res);
    res.json = jest.fn<(body: any) => Response>().mockReturnValue(res);
    return res;
};

describe('UsersController', () => {
    beforeAll(async () => {
        await setupTestDB();
        await UserModel.create({
            first_name: 'test user controller get one user',
            last_name: 'Doe',
            email: 'test@test.com',
            password: '123456',
            nick_name: 'tester',
        });
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('getOneUser >> should respond with 404 when the user does not exist', async () => {
        const req = { params: { id: '999' } } as unknown as Request<{ id: string }>;
        const res = createMockResponse();

        await getOneUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });


    it('getOneUser >> should respond with 200 and return the user data when the user exists', async () => {
        const user = await UserModel.findOne({ where: { email: 'test@test.com' } });
        const req = { params: { id: user!.id.toString() } } as unknown as Request<{ id: string }>;
        const res = createMockResponse();

        await getOneUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    id: user!.id,
                    email: user!.email
                })
            })
        );
    });


});
