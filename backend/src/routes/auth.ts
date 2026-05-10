import { Router, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";
import prisma from "../lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const router = Router();

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      city,
      country,
      countryCode,
      phoneNo,
      bio,
    } = req.body;

    // 1. Validation
    if (!email || !password || !firstName || !lastName || !city || !phoneNo) {
      return res.status(400).json({ error: "email, password, firstName, lastName, city, phoneNo required" });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNo }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User with this email or phone number already exists",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        city,
        country,
        countryCode,
        phoneNo,
        bio,
        role: "USER",
      },
    });

    // 5. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRATE || "default_secret",
      { expiresIn: "7d" }
    );

    // 6. Return response (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 4. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRATE || "default_secret",
      { expiresIn: "7d" }
    );

    // 5. Return response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route   POST /auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // For security, don't reveal if user exists or not
    if (!user) {
      return res.json({
        message: "If an account with that email exists, we have sent a reset link.",
      });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store token
    await prisma.passwordResetToken.upsert({
      where: { email },
      update: { token, expiresAt },
      create: { email, token, expiresAt },
    });

    // Send email
    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${token}`;

    console.log(`Attempting to send reset email to: ${email}`);
    const { data, error: resendError } = await resend.emails.send({
      from: "Traveloop <onboarding@resend.dev>",
      to: email,
      subject: "Reset Your Password - Traveloop",
      html: `
        <h1>Password Reset Request</h1>
        <p>You requested a password reset for your Traveloop account.</p>
        <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    if (resendError) {
      console.error("Resend API Error:", resendError);
      return res.status(500).json({ error: "Failed to send email via Resend" });
    }

    console.log("Resend API Success Data:", data);

    res.json({
      message: "If an account with that email exists, we have sent a reset link.",
    });
  } catch (error) {
    console.error("Forgot Password Internal Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @route   POST /auth/reset-password
// @desc    Reset password using token
// @access  Public
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required" });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user
    await prisma.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    // Delete token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
