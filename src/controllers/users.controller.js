import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "E-mail já cadastrado!" });

    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = await prisma.user.create({
      data: { nome, email, senha: hashedPassword },
    });

    res.status(201).json({ message: "Usuário criado com sucesso!", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

export const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas!" });

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) return res.status(401).json({ error: "Credenciais inválidas!" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado!" });

    res.json({ id: user.id, nome: user.nome, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar perfil." });
  }
};

