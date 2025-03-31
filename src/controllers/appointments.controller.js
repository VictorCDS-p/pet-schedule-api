import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAppointment = async (req, res) => {
  const { petId, dataHora } = req.body;

  try {
    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet || pet.donoId !== req.user.userId) {
      return res.status(403).json({ error: "Acesso negado!" });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        petId,
        dataHora: new Date(dataHora),
        status: "pendente",
      },
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { donoId: req.user.userId },
      include: { agendamentos: true },
    });

    const appointments = pets.flatMap((pet) => pet.agendamentos);
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar agendamentos." });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { pet: true },
    });

    if (!appointment || appointment.pet.donoId !== req.user.userId) {
      return res.status(403).json({ error: "Acesso negado!" });
    }

    await prisma.appointment.delete({ where: { id } });

    res.json({ message: "Agendamento cancelado!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cancelar agendamento." });
  }
};
