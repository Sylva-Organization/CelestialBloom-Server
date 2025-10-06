import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { UserModel } from "../models/UserModel.js";
import configData from '../config/config.js';

const jwtConfig = configData.jwt;
const JWT_SECRET = jwtConfig.jwtSecret;
const JWT_EXPIRES = jwtConfig.jwtExpires;


function signToken(payload: object) {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return token;
}


// register
export const register = async (req: Request, res: Response) => {
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

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      password: hashed,
      nick_name,
    });

    const token = signToken({ id: user.id, role: user.role });
    const safe = await UserModel.findByPk(user.id, { attributes: { exclude: ["password"] } });

    return res.status(201).json({ data: safe, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

//login
export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "identifier and password are required" });
    }

    const user = await UserModel.findOne({
      where: { [Op.or]: [{ email: identifier }, { nick_name: identifier }] },
    });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user.id, role: user.role });
    const safe = await UserModel.findByPk(user.id, { attributes: { exclude: ["password"] } });

    return res.status(200).json({ data: safe, token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
