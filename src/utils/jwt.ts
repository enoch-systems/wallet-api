import jwt from "jsonwebtoken";

const SECRET = "supersecretkey"; // we improve later

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};