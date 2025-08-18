import { Router } from "express";
import { authMiddleware, requireRole } from "../middlewares/authMiddleware";
import { createUserUseCase, updateUserUseCase, deleteUserUseCase, userRepository } from "../services/userService";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await createUserUseCase.execute(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al crear usuario" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await updateUserUseCase.execute(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al actualizar usuario" });
  }
});

router.delete("/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    await deleteUserUseCase.execute(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al eliminar usuario" });
  }
});

export default router;