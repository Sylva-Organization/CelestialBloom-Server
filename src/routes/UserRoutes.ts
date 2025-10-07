import { Router } from 'express';
import {
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser
}from '../controllers/UsersController.js';
//import * as PostsController from '../controllers/PostsController.js'
// import * as AuthController from


const UserRouter = Router();

// Users
UserRouter.get('/', getAllUsers);
//UserRouter.post('/', )
UserRouter.put('/:id', updateUser);
UserRouter.delete('/:id', deleteUser);
UserRouter.get('/:id', getOneUser);

export default UserRouter;

// Posts
// router.get('/posts', PostsController);
// router.post('/posts', PosgetAllUsers,


// Auth
// router.post('/auth/register', AuthController.register);
// router.post('/auth/login', AuthController.login);


