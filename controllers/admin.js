import Admin from "../model/admin.js";
import bcrypt from "bcryptjs";
import { encryptAES } from "../libs/crypto.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const resgisterAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        const admin = await Admin.findOne({ email });

        if (admin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            email,
            password: passwordHash
        });
        await newAdmin.save();
        res.status(200).json({ message: "Admin created successfully" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
        return res.status(400).json({ message: "Admin does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const sessionId = crypto.randomUUID();
    const nonce = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now().toString();
    const encryptedSid = encryptAES(sessionId, timestamp);
    const encryptedNonce = encryptAES(nonce, timestamp);

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const tokenData = {
        sessionId: encryptedSid,
        nonce: encryptedNonce,
        email: admin.email,
        useId: admin._id,
        role: "admin",
        ip,
        userAgent,
        timestamp,
        jti: crypto.randomUUID(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 60
    };

    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(tokenData, secretKey, { algorithm: "HS256" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 30 * 60 * 1000,
        signed: true,
    });

    res.status(200).json({ message: "User logged in successfully", token });

}

export { resgisterAdmin, loginAdmin };