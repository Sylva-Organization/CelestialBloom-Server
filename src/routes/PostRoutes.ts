import { Router } from "express";
import {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/PostsController.js";
import { checkrole } from "../middlewares/roleMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const PostRouter = Router();

PostRouter.get("/", authMiddleware, checkrole(['admin', 'user']), getAllPosts);
PostRouter.get("/:id", authMiddleware, checkrole(['admin', 'user']), getOnePost);
PostRouter.post("/", authMiddleware, checkrole(['admin']), createPost);
PostRouter.put("/:id", authMiddleware, checkrole(['admin']), updatePost);
PostRouter.delete("/:id", authMiddleware, checkrole(['admin',]), deletePost);

export default PostRouter;
