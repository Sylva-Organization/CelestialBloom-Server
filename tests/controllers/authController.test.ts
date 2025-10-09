
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

});