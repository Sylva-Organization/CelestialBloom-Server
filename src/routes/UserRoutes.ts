import { Router } from 'express';
import {
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}from '../controllers/UsersController.js';
import { validateDeleteUser, validateGetAllUsers, validateUpdateUser, validateUserId } from '../Validations/UserValidations.js';
//import * as PostsController from '../controllers/PostsController.js'
//import { validateUpdateUser,  } from '../Validations/UserValidations.js';


const UserRouter = Router();



// Users
UserRouter.get('/', validateGetAllUsers, getAllUsers );
//UserRouter.post('/', )
UserRouter.put('/:id', validateUpdateUser, updateUser );
UserRouter.delete('/:id', validateDeleteUser, deleteUser );
UserRouter.get('/:id', validateUserId, getOneUser );

export default UserRouter;

// Posts
// router.get('/posts', PostsController);
// router.post('/posts', PosgetAllUsers,


// Auth
// router.post('/auth/register', AuthController.register);
// router.post('/auth/login', AuthController.login);


