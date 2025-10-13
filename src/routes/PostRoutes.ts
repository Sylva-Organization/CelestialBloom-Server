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

PostRouter.get("/", authMiddleware, getAllPosts);
PostRouter.get("/:id", authMiddleware, getOnePost);
PostRouter.post("/", authMiddleware, checkrole(['admin']), createPost);
PostRouter.put("/:id", authMiddleware, checkrole(['admin']), updatePost);     
PostRouter.delete("/:id", authMiddleware, checkrole(['admin',]), deletePost);

export default PostRouter;
