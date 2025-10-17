import { Router } from 'express';
import {
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}from '../controllers/UsersController.js';
import { validateDeleteUser, validateGetAllUsers, validateUpdateUser, validateUserId } from '../validations/UserValidations.js';
import { checkrole } from '../middlewares/roleMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';


const UserRouter = Router();



// Users
UserRouter.get('/', authMiddleware, checkrole(['admin']), validateGetAllUsers, getAllUsers );
UserRouter.put('/:id', authMiddleware, validateUpdateUser, updateUser );
UserRouter.delete('/:id', authMiddleware, checkrole(['admin']), validateDeleteUser, deleteUser );
UserRouter.get('/:id',authMiddleware, validateUserId, getOneUser );

export default UserRouter;



