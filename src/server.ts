import express from "express";
import { prisma } from "./config/prisma";


const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();

  res.json({
    message: "Wallet API running",
    users
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

