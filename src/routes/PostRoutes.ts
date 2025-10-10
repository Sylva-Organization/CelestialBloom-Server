import { Router } from "express";
import {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/PostsController.js";

const PostRouter = Router();

PostRouter.get("/", getAllPosts);
PostRouter.get("/:id", getOnePost);
PostRouter.post("/", createPost);
PostRouter.put("/:id", updatePost);     
PostRouter.delete("/:id", deletePost);

export default PostRouter;
