import type { Request, Response } from "express";
import { Op } from "sequelize";
import { PostModel } from "../models/PostModel.js";
import { UserModel } from "../models/UserModel.js";
import { CategoryModel } from "../models/CategoryModel.js";

// GET /posts?search=&page=&limit=&author_id=&category_id=
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
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: { exclude: ["password"] },
        },
        {
          model: CategoryModel,
          as: "category",
        },
      ],
    });

    return res.status(200).json({ data: rows, meta: { page, limit, total: count } });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /posts/:id
export const getOnePost = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await PostModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "author",
          attributes: { exclude: ["password"] },
        },
        {
          model: CategoryModel,
          as: "category",
        },
      ],
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    return res.status(200).json({ data: post });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};


