import type { Request, Response } from "express";
import { Op } from "sequelize";
import { UserModel } from "../models/UserModel.js";
import { PostModel } from "../models/PostModel.js";

// Get 
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Number(req.query["page"] as string) || 1);
        const limit = Math.min(100, Number(req.query["limit"] as string) || 20);
        const offset = (page - 1) * limit;
        const search = (req.query["search"] as string) || "";

        const whereCondition = search
            ? {
                [Op.or]: [
                    { first_name: { [Op.like]: `${search}%` } },
                    { last_name: { [Op.like]: `${search}%` } },
                    { email: { [Op.like]: `${search}%` } },
                    { nick_name: { [Op.like]: `${search}%` } },
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

//create
export const createUser = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password, nick_name } = req.body;

        if (!first_name || !last_name || !email || !password || !nick_name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const exists = await UserModel.findOne({
            where: { [Op.or]: [{ email }, { nick_name }] },
        });
        if (exists) {
            return res.status(400).json({ message: "Email or nickname already exists" });
        }

        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            password, 
            nick_name,
          
        });

        // Responder sin que se vea la contraseña
        const safe = await UserModel.findByPk(user.id, {
            attributes: { exclude: ["password"] },
        });

        return res.status(201).json({ data: safe });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = Number(req.params.id);

    // comprobamos que existe
    const user = await UserModel.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // asegura que no se repitan los noicks ni los correos
    const { email, nick_name, password, first_name, last_name } = req.body as {
      email?: string;
      nick_name?: string;
      password?: string;
      first_name?: string;
      last_name?: string;
    };

    if (email) {
      const emailTaken = await UserModel.findOne({
        where: { email, id: { [Op.ne]: id } },
      });
      if (emailTaken) return res.status(400).json({ message: "Email already exists" });
    }

    if (nick_name) {
      const nickTaken = await UserModel.findOne({
        where: { nick_name, id: { [Op.ne]: id } },
      });
      if (nickTaken) return res.status(400).json({ message: "Nickname already exists" });
    }

    // preparar datos a actualizar (solo campos permitidos)
    const updateData: Partial<{
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      nick_name: string;
    }> = {};

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (nick_name !== undefined) updateData.nick_name = nick_name;

    if (password !== undefined && password !== null && password !== "") {
      // const hashed = await bcrypt.hash(password, 10); // cuando activéis auth
      // updateData.password = hashed;
      updateData.password = password; // aqui se esta guardando pero en texto plano, quitar cuando active bcrypt
    }

    // 4) actualizar y devolver sin password (y con posts, opcional)
    await user.update(updateData);

    const updated = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [{ model: PostModel, as: "posts", attributes: ["id", "title", "image", "createdAt"] }],
    });

    return res.status(200).json({ data: updated });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

