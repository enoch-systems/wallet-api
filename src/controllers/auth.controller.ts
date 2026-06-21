import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    // basic check
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user + wallet
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // plain for now (we fix security later step)
        wallet: {
          create: {
            balance: 0
          }
        }
      },
      include: {
        wallet: true
      }
    });

    return res.json({
      message: "User created",
      data: user
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user.id);

    return res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
