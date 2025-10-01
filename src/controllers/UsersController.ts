import type { Request, Response } from "express";
import { Op } from "sequelize";
import { UserModel } from "../models/UserModel.js";
import { PostModel } from "../models/PostModel.js";

// Get 
export const getAllUsers = async (req: Request , res: Response) => {
  try {
    const page = Math.max(1, Number(req.query["page"] as string) || 1);
    const limit = Math.min(100, Number(req.query["limit"] as string) || 20);
    const offset = (page - 1) * limit;
    const search = (req.query["search"] as string) || "";
    
    const whereCondition = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `${search}%` } },
            { last_name:  { [Op.like]: `${search}%` } },
            { email:      { [Op.like]: `${search}%` } },
            { nick_name:  { [Op.like]: `${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await UserModel.findAndCountAll({
    where: whereCondition,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ data: rows, meta: { page, limit, total: count } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get by id
export const getOneUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await UserModel.findByPk(id, {
      include: [{ model: PostModel, as: "posts", attributes: ["id", "title", "image", "createdAt"] }],
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
