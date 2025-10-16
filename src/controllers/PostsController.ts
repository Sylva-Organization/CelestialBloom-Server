import type { Request, Response } from "express";
import { Op } from "sequelize";
import type { IncludeOptions } from "sequelize";
import { PostModel } from "../models/PostModel.js";
import { UserModel } from "../models/UserModel.js";
import { CategoryModel } from "../models/CategoryModel.js";


const POST_INCLUDES: IncludeOptions[] = [
  {
    model: UserModel,
    as: "author",
    attributes: { exclude: ["password"] },
  },
  {
    model: CategoryModel,
    as: "category",
  },
];


export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query["page"] as string) || 1);
    const limit = Math.min(100, Number(req.query["limit"] as string) || 20);
    const offset = (page - 1) * limit;

    const search = (req.query["search"] as string) || "";
    const author_id = req.query["author_id"] ? Number(req.query["author_id"]) : undefined;
    const category_id = req.query["category_id"] ? Number(req.query["category_id"]) : undefined;

    const whereCondition: any = {};

    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }
    if (author_id !== undefined && !Number.isNaN(author_id)) {
      whereCondition.author_id = author_id;
    }
    if (category_id !== undefined && !Number.isNaN(category_id)) {
      whereCondition.category_id = category_id;
    }

    const { rows, count } = await PostModel.findAndCountAll({
      where: whereCondition,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      include: POST_INCLUDES,
    });

    return res.status(200).json({ data: rows, meta: { page, limit, total: count } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


export const getOnePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await PostModel.findByPk(id, {
      include: POST_INCLUDES,
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({ data: post });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// POST 
export const createPost = async (req: Request, res: Response) => {
  try {
    const author_id = req.user?.id
    const { title, content, image, category_id } = req.body as {
      title?: string;
      content?: string;
      image?: string;
      author_id?: number;
      category_id?: number;
    };

    if (!title || !content || !image || !author_id || !category_id) {
      return res.status(400).json({ message: "title, content, image, author_id and category_id are required" });
    }

    // validate existance of author and category
    const [author, category] = await Promise.all([
      UserModel.findByPk(Number(author_id)),
      CategoryModel.findByPk(Number(category_id)),
    ]);

    if (!author) return res.status(400).json({ message: "Author (author_id) does not exist" });
    if (!category) return res.status(400).json({ message: "Category (category_id) does not exist" });

    const createdPost = await PostModel.create({
      title,
      content,
      image,
      author_id: Number(author_id),
      category_id: Number(category_id),
    });

    const createdWithIncludes = await PostModel.findByPk(createdPost.id, {
      include: POST_INCLUDES,
    });

    return res.status(201).json({ data: createdWithIncludes });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH/PUT 
export const updatePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await PostModel.findByPk(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const author_id = req.user?.id;
    const { title, content, image, category_id } = req.body as {
      title?: string;
      content?: string;
      image?: string;
      author_id?: number;
      category_id?: number;
    };

    const updateData: Partial<{
      title: string;
      content: string;
      image: string;
      author_id: number;
      category_id: number;
    }> = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (image !== undefined) updateData.image = image;

    if (author_id !== undefined) {
      const author = await UserModel.findByPk(Number(author_id));
      if (!author) return res.status(400).json({ message: "Author (author_id) does not exist" });
      updateData.author_id = Number(author_id);
    }

    if (category_id !== undefined) {
      const category = await CategoryModel.findByPk(Number(category_id));
      if (!category) return res.status(400).json({ message: "Category (category_id) does not exist" });
      updateData.category_id = Number(category_id);
    }

    await post.update(updateData);

    const updated = await PostModel.findByPk(id, {
      include: POST_INCLUDES,
    });

    return res.status(200).json({ data: updated });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await PostModel.findByPk(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await PostModel.destroy({ where: { id } });

    return res.status(200).json({ message: "The post has been deleted successfully!" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};