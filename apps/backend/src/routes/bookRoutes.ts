import { Router } from "express";
import { bookUseCase } from "../services/bookService";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const books = await bookUseCase.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener libros" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await bookUseCase.getBookById(req.params.id);
    if (!book) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener libro" });
  }
});

router.post("/", async (req, res) => {
  try {
    const book = await bookUseCase.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al crear libro" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const book = await bookUseCase.updateBook(req.params.id, req.body);
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al actualizar libro" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await bookUseCase.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al eliminar libro" });
  }
});

export default router;