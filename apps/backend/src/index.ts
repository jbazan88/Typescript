import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { BookUseCase } from "../../../domain/src/use-cases/BookUseCase";
import { CartUseCase } from "../../../domain/src/use-cases/CartUseCase";
import { OrderUseCase } from "../../../domain/src/use-cases/OrderUseCase";
import { UserAdminUseCase } from "../../../domain/src/use-cases/user/UserUseCase";
import { Book } from "../../../domain/src/entities/Book";
import { User } from "../../../domain/src/entities/User";

// Implementaciones en memoria para BookRepository y UserRepository
class InMemoryBookRepository {
  private books: Book[] = [
    { id: "1", titulo: "Libro 1", autorId: "a1", precio: 100, stock: 5 },
    { id: "2", titulo: "Libro 2", autorId: "a2", precio: 150, stock: 3 },
  ];

  async findAll() { return this.books; }
  async findById(id: string) { return this.books.find(b => b.id === id) || null; }
  async create(book: Omit<Book, 'id'>) {
    const newBook = { ...book, id: (Date.now() + Math.random()).toString() };
    this.books.push(newBook);
    return newBook;
  }
  async update(book: Partial<Book>) {
    const idx = this.books.findIndex(b => b.id === book.id);
    if (idx === -1) throw new Error("Libro no encontrado");
    this.books[idx] = { ...this.books[idx], ...book };
    return this.books[idx];
  }
  async delete(id: string) {
    const idx = this.books.findIndex(b => b.id === id);
    if (idx !== -1) this.books.splice(idx, 1);
  }
  async verifyStock(id: string) {
    const book = this.books.find(b => b.id === id);
    return !!book && book.stock > 0;
  }
  async updateStock(id: string, cantidad: number) {
    const book = this.books.find(b => b.id === id);
    if (!book) throw new Error("Libro no encontrado");
    book.stock += cantidad;
  }
}

class InMemoryUserRepository {
  private users: User[] = [
    { id: "u1", name: "Admin", email: "admin@mail.com", password: "admin", role: "admin" }
  ];

  async findAll() { return this.users; }
  async findByEmail(email: string) { return this.users.find(u => u.email === email) || null; }
  async findById(id: string) { return this.users.find(u => u.id === id) || null; }
  async create(user: Pick<User, "name" | "email" | "password" | "role">) {
    const newUser = { ...user, id: (Date.now() + Math.random()).toString() };
    this.users.push(newUser);
    return newUser;
  }
  async update(user: Partial<User>) {
    const idx = this.users.findIndex(u => u.id === user.id);
    if (idx === -1) throw new Error("Usuario no encontrado");
    this.users[idx] = { ...this.users[idx], ...user };
    return this.users[idx];
  }
  async delete(id: string) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) this.users.splice(idx, 1);
  }
}

// Instanciar repositorios y casos de uso
const bookRepository = new InMemoryBookRepository();
const userRepository = new InMemoryUserRepository();

const bookUseCase = new BookUseCase(bookRepository);
const userAdminUseCase = new UserAdminUseCase(userRepository);
// CartUseCase y OrderUseCase pueden instanciarse según tu lógica

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint para usuarios
app.get("/api/usuarios", async (req, res) => {
  const users = await userAdminUseCase.getAllUsers();
  res.json(users);
});

// Endpoint para libros
app.get("/api/libros", async (req, res) => {
  const books = await bookUseCase.getAllBooks();
  res.json(books);
});

// Puedes agregar endpoints para pedidos y carrito según tus casos de uso

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});