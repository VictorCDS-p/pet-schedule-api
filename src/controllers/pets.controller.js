import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPet = async (req, res) => {
  const { nome, especie } = req.body;

  try {
    const newPet = await prisma.pet.create({
      data: {
        nome,
        especie,
        donoId: req.user.userId,
      },
    });

    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar pet." });
  }
};

export const getPetsByUser = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { donoId: req.user.userId },
    });

    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pets." });
  }
};

export const deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await prisma.pet.findUnique({ where: { id } });
    if (!pet || pet.donoId !== req.user.userId) {
      return res.status(403).json({ error: "Acesso negado!" });
    }

    await prisma.pet.delete({ where: { id } });

    res.json({ message: "Pet excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir pet." });
  }
};

export const getAllPets = async (req, res) => {
    try {
      const pets = await prisma.pet.findMany({
        include: { dono: { select: { nome: true, email: true } } }, // Inclui info do dono
      });
  
      res.json(pets);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar todos os pets." });
    }
  };
  
