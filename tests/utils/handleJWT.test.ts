jest.mock('dotenv', () => ({
    config: jest.fn(() => ({
        parsed: { JWT_SECRET: 'test-secret' }
    })),
}));

import { describe, it, expect, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../src/utils/handleJWT.js';

describe('HandleJWT', () => {

    describe('generateToken', () => {
        const user = { id: 1, role: 'user' };

        it('should throw error when JWT_SECRET is not configured', () => {
            process.env.JWT_SECRET = '';

            const generateToken = () => {
                const jwtSecret = process.env.JWT_SECRET;
                if (!jwtSecret) throw new Error("JWT_SECRET not configured");

                return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '2h' });
            };

            expect(generateToken).toThrow("JWT_SECRET not configured");
        });

        it('should return a valid JWT token when secret is configured', () => {
            process.env.JWT_SECRET = 'testmysecretkey';

            const generateToken = () => {
                const jwtSecret = process.env.JWT_SECRET!;
                return jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '4h' });
            };

            const token = generateToken();

            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            expect(decoded).toMatchObject({ id: user.id, role: user.role });
        });
    });

    describe('verifyToken', () => {
        const payload = { id: 1, role: 'user' };
        const realSecret = process.env.JWT_SECRET!;

        it('should return decoded payload when token is valid', async () => {
            const token = jwt.sign(payload, realSecret, { expiresIn: '1h' });
            const result = await verifyToken(token);

            expect(result).toMatchObject(payload);
        });

        it('should return null when token is invalid', async () => {
            const result = await verifyToken('invalid.token');

            expect(result).toBeNull();
        });
    });
});