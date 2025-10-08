import { describe, it, beforeAll, afterAll, expect, jest } from '@jest/globals';
import type { Request, Response } from 'express';
import { getOneUser, deleteUser, getAllUsers, updateUser } from '../../src/controllers/UsersController.js';
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
            first_name: 'test user controller',
            last_name: 'Doe',
            email: 'test@test.com',
            password: '123456',
            nick_name: 'tester',
        });
        await UserModel.create({
            first_name: 'test 2 user controller',
            last_name: 'Doe',
            email: 'test2@test.com',
            password: 'test123',
            nick_name: 'teste2',
        });

        await UserModel.create({
            first_name: 'test 3 user controller',
            last_name: 'Doe',
            email: 'test3@test.com',
            password: 'test123',
            nick_name: 'teste3',
        });

        await UserModel.create({
            first_name: 'test 4 user controller',
            last_name: 'Doe',
            email: 'test4@test.com',
            password: 'test123',
            nick_name: 'teste4',
        });
    });

    afterAll(async () => {
        await teardownTestDB();
    });
    describe('getOneUser', () => {
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

        it('getOneUser >> should respond with 500 and a execption occurs', async () => {
            const req = { params: { id: '1' } } as unknown as Request<{ id: string }>;
            const res = createMockResponse();
            const original: typeof UserModel.findByPk = UserModel.findByPk;

            UserModel.findByPk = async () => { throw new Error('Database error'); };

            await getOneUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

            UserModel.findByPk = original;
        });
    });
    describe('getAllUsers', () => {
        it('getAllUsers >> should respond with 200 and return all users', async () => {
            const user = await UserModel.findOne();
            const req = { query: {} } as unknown as Request;
            const res = createMockResponse();

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.arrayContaining([
                        expect.objectContaining({ id: user!.id, email: user!.email })])
                })
            );
        });

        it('getAllUsers >> should respond with 200 and return filters users', async () => {
            const req = { query: { search: 'test' } } as unknown as Request;
            const res = createMockResponse();

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.arrayContaining([
                        expect.objectContaining({ email: 'test2@test.com' })
                    ])
                })
            );
        });

        it('getAllUsers >> should respond with 500 and a execption occurs', async () => {
            const req = { query: {} } as unknown as Request;
            const res = createMockResponse();
            const original: typeof UserModel.findAndCountAll = UserModel.findAndCountAll;
            UserModel.findAndCountAll = async () => { throw new Error('Database error'); };

            await getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

            UserModel.findAndCountAll = original;
        });

    });
    describe('deleteUser', () => {
        it('deleteUser >> should respond with 200 and success message', async () => {
            const user = await UserModel.findOne({ where: { email: 'test@test.com' } });
            const req = { params: { id: user!.id.toString() } } as unknown as Request<{ id: string }>;
            const res = createMockResponse();

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "The user has been deleted successfully!" }));
        });

        it('deleteUser >> should respond with 404 when the user does not exist', async () => {
            const req = { params: { id: '999' } } as unknown as Request<{ id: string }>;
            const res = createMockResponse();

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('deleteUser >> should respond with 500 and a execption occurs', async () => {
            const req = { params: { id: '1' } } as unknown as Request<{ id: string }>;
            const res = createMockResponse();
            const original: typeof UserModel.findByPk = UserModel.findByPk;

            UserModel.findByPk = async () => { throw new Error('Database error'); };

            await deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });

            UserModel.findByPk = original;
        });
    });
    describe('updateUser', () => {
        it('updateUser >> should respond with 200 and sucess message', async () => {
            const user = await UserModel.findOne({ where: { nick_name: 'teste2' } });
            const userUpdated = { first_name: "Name change" };
            const req = { params: { id: user!.id.toString() }, body: userUpdated } as unknown as Request<{ id: string }>;
            const res = createMockResponse();

            await updateUser(req, res);

            expect(res.status).toHaveBeenLastCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        id: user!.id,
                        first_name: userUpdated.first_name
                    })
                })
            );
        });
        it('updateUser >> should respond with 400 if email or nickname already exists', async () => {
            const userThree = await UserModel.findOne({ where: { nick_name: 'teste3' } });
            const userFour = await UserModel.findOne({ where: { email: 'test4@test.com' } });

            const emailReq = {
                params: { id: userThree!.id.toString() },
                body: { email: userFour!.email }
            } as unknown as Request<{ id: string }>;

            const emailRes = createMockResponse();

            await updateUser(emailReq, emailRes);

            expect(emailRes.status).toHaveBeenCalledWith(400);
            expect(emailRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Email already exists" })
            );

            const nickNameReq = {
                params: { id: userThree!.id.toString() },
                body: { nick_name: userFour!.nick_name }
            } as unknown as Request<{ id: string }>;

            const nickNameRes = createMockResponse();

            await updateUser(nickNameReq, nickNameRes);

            expect(nickNameRes.status).toHaveBeenCalledWith(400);
            expect(nickNameRes.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Nickname already exists" })
            );
        });

    });
});
