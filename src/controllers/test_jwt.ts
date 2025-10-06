import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env["JWT_SECRET"] || "testsecret";
const JWT_EXPIRES = "1h";

const payload = { id: 1, role: "user" };

try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    console.log("✅ Token gerado:", token);

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verificado:", decoded);
} catch (err) {
    console.error("❌ Erro:", err);
}