import StudentAuth from "../model/student_auth.js";
import bcrypt from "bcryptjs";
import { encryptAES } from "../libs/crypto.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "redis";

const redisClient = createClient({
    url: 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const studentRegister = async (req, res) => {
    try {
        const { email, number, id, password, name, session, department, profileImage } = req.body;

        if (!email || !number || !id || !password || !name || !session || !department || !profileImage) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const numberRegex = /^\d{10,15}$/;
        if (!numberRegex.test(number)) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }

        const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
        if (!urlRegex.test(profileImage)) {
            return res.status(400).json({ message: "Invalid profile image URL" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character" });
        }

        const userExists = await StudentAuth.findOne({ id });
        if (userExists) {
            return res.status(400).json({ message: "User with this ID already exists" });
        }

        const verificationCode = Math.floor(10000000 + Math.random() * 90000000).toString();
        const verificationCodeExpires = 2 * 60;

        const userData = {
            email,
            number,
            id,
            password,
            name,
            session,
            isVerified: false,
            department,
            profileImage
        };

        await redisClient.set(email, JSON.stringify({ verificationCode, userData }), {
            EX: verificationCodeExpires
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to College Management System - Verify Your Email',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <h2 style="color: #333;">Welcome to College Management System!</h2>
                        <p style="color: #555; font-size: 16px;">Dear ${name},</p>
                        <p style="color: #555; font-size: 16px;">We’re excited to have you on board! Please verify your email to activate your student account.</p>
                    </div>
                    <div style="background-color: #fff; padding: 20px; border-radius: 5px; text-align: center;">
                        <p style="color: #555; font-size: 16px;">Your verification code is:</p>
                        <h1 style="color: #007bff; margin: 10px 0;">${verificationCode}</h1>
                        <p style="color: #777; font-size: 14px;">This code will expire in <strong>2 minutes</strong>. Please use it to complete your registration.</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
                        <p>If you didn’t sign up, you can safely ignore this email.</p>
                        <p>For assistance, reach out to <a href="mailto:support@college.edu" style="color: #007bff;">support@college.edu</a></p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
                        <p>&copy; ${new Date().getFullYear()} College Management System. All Rights Reserved.</p>
                    </div>
                </div>`
        };
        


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Error sending verification email" });
            } else {
                res.status(200).json({ message: "Verification code sent successfully. Please check your email." });
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, verificationCode } = req.body;
        const storedData = await redisClient.get(email);

        if (!storedData) {
            return res.status(400).json({ message: "Verification code not found or expired" });
        }

        const { verificationCode: storedCode, userData } = JSON.parse(storedData);

        if (storedCode !== verificationCode) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = new StudentAuth({
            ...userData,
            password: hashedPassword
        });

        await user.save();

        res.status(200).json({ message: "Email verified and user registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const studentLogin = async (req, res) => {
    try {
        const { email, number, id, password } = req.body;

        if ((!email && !number && !id) || !password) {
            return res.status(400).json({ message: "Please provide email, number, or ID and password" });
        }

        let user;
        if (email) {
            user = await StudentAuth.findOne({ email });
        } else if (number) {
            user = await StudentAuth.findOne({ number });
        } else if (id) {
            user = await StudentAuth.findOne({ id });
        }

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "User not verified" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
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
            userId: user._id,
            id: user.id,
            name: user.name,
            email: user.email,
            role: "student",
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

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const studentForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide an email" });
        }

        const user = await StudentAuth.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const resetCode = Math.floor(10000000 + Math.random() * 90000000).toString();
        const resetCodeExpires = 2 * 60;

        await redisClient.set(email, JSON.stringify({ resetCode }), {
            EX: resetCodeExpires
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset - College Management System',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <h2 style="color: #333;">College Management System</h2>
                        <p style="color: #555; font-size: 16px;">Password Reset Request</p>
                    </div>
                    <div style="background-color: #fff; padding: 20px; border-radius: 5px; text-align: center;">
                        <p style="color: #555; font-size: 16px;">Dear ${user.name},</p>
                        <p style="color: #555; font-size: 16px;">We received a request to reset your password. Use the code below to proceed:</p>
                        <h1 style="color: #007bff; margin: 10px 0;">${resetCode}</h1>
                        <p style="color: #777; font-size: 14px;">This code will expire in <strong>2 minutes</strong>.</p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
                        <p>If you didn’t request this, please ignore this email.</p>
                        <p>For support, contact us at <a href="mailto:support@college.edu" style="color: #007bff;">support@college.edu</a></p>
                    </div>
                    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 10px;">
                        <p>&copy; ${new Date().getFullYear()} College Management System. All Rights Reserved.</p>
                    </div>
                </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Error sending reset email" });
            } else {
                res.status(200).json({ message: "Reset code sent successfully. Please check your email." });
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const studentResetPassword = async (req, res) => {
    try {
        const { email, resetCode, newPassword } = req.body;

        if (!email || !resetCode || !newPassword) {
            return res.status(400).json({ message: "Please provide email, reset code, and new password" });
        }

        const storedData = await redisClient.get(email);

        if (!storedData) {
            return res.status(400).json({ message: "Reset code not found or expired" });
        }

        const { resetCode: storedCode } = JSON.parse(storedData);

        if (storedCode !== resetCode) {
            return res.status(400).json({ message: "Invalid reset code" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await StudentAuth.updateOne({ email }, { password: hashedPassword });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
};


export { studentRegister, studentLogin, verifyEmail, studentForgotPassword, studentResetPassword };