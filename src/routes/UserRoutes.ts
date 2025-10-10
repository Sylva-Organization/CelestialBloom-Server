import { Router } from 'express';
import {
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}from '../controllers/UsersController.js';
import { validateDeleteUser, validateGetAllUsers, validateUpdateUser, validateUserId } from '../Validations/UserValidations.js';


const UserRouter = Router();



// Users
UserRouter.get('/', validateGetAllUsers, getAllUsers );
UserRouter.put('/:id', validateUpdateUser, updateUser );
UserRouter.delete('/:id', validateDeleteUser, deleteUser );
UserRouter.get('/:id', validateUserId, getOneUser );

export default UserRouter;



