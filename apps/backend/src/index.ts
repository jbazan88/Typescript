import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { AuthorUseCase } from "../../../domain/src/use-cases/AuthorUseCase";
import { BookUseCase } from "../../../domain/src/use-cases/BookUseCase";
import { CartUseCase } from "../../../domain/src/use-cases/CartUseCase";
import { OrderUseCase } from "../../../domain/src/use-cases/OrderUseCase";
import { CreateUserUseCase } from "../../../domain/src/use-cases/user/CreateUser";
import { UpdateUserUseCase } from "../../../domain/src/use-cases/user/UpdateUser";
import { DeleteUserUseCase } from "../../../domain/src/use-cases/user/DeleteUser";
import { Author } from "../../../domain/src/entities/Author";
import { Book } from "../../../domain/src/entities/Book";
import { Cart } from "../../../domain/src/entities/Cart";
import { Order } from "../../../domain/src/entities/Order";
import { User } from "../../../domain/src/entities/User";


// Implementación en memoria para BookRepository
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

// Implementación en memoria para UserRepository
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
  async update(id: string, userData: Partial<User>) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error("Usuario no encontrado");
    this.users[idx] = { ...this.users[idx], ...userData };
    return this.users[idx];
  }
  async delete(id: string) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) this.users.splice(idx, 1);
  }
}

// Implementación en memoria para AuthorRepository
class InMemoryAuthorRepository {
  private authors: Author[] = [
    { 
      id: "a1", 
      nombre: "Autor Uno", 
      biografia: "Biografía del autor uno",
      fechaNacimiento: new Date("1980-01-01")
    },
    { 
      id: "a2", 
      nombre: "Autor Dos", 
      biografia: "Biografía del autor dos",
      fechaNacimiento: new Date("1975-05-15")
    }
  ];

  async findAll() { return this.authors; }
  async findById(id: string) { return this.authors.find(a => a.id === id) || null; }
  async create(author: Omit<Author, "id">) {
    const newAuthor = { ...author, id: (Date.now() + Math.random()).toString() };
    this.authors.push(newAuthor);
    return newAuthor;
  }
  async update(author: Partial<Author>) {
    const idx = this.authors.findIndex(a => a.id === author.id);
    if (idx === -1) throw new Error("Autor no encontrado");
    this.authors[idx] = { ...this.authors[idx], ...author };
    return this.authors[idx];
  }
  async delete(id: string) {
    const idx = this.authors.findIndex(a => a.id === id);
    if (idx !== -1) this.authors.splice(idx, 1);
  }
}

// Implementación en memoria para OrderRepository
class InMemoryOrderRepository {
  private orders: Order[] = [];
  private idCounter = 1;

  async save(order: Omit<Order, "id" | "fecha">) {
    const newOrder: Order = { 
      ...order, 
      id: (this.idCounter++).toString(), 
      fecha: new Date() 
    };
    this.orders.push(newOrder);
    return newOrder;
  }
  
  async findById(id: string) {
    return this.orders.find(o => o.id === id) || null;
  }
  
  async findByUser(usuarioId: string) {
    return this.orders.filter(o => o.usuario.id === usuarioId);
  }
  
  async updateStatus(id: string, newStatus: any) {
    const order = this.orders.find(o => o.id === id);
    if (!order) throw new Error("Orden no encontrada");
    order.estado = newStatus;
    return order;
  }
  
  async findByStatus(status: any) {
    return this.orders.filter(o => o.estado === status);
  }
}

// Implementación en memoria para CartRepository
class InMemoryCartRepository {
  private carts: { [userId: string]: Cart[] } = {};

  async getCart(userId: string): Promise<Cart[]> {
    return this.carts[userId] || [];
  }
  async saveCart(userId: string, items: Cart[]): Promise<void> {
    this.carts[userId] = items;
  }
  async clearCart(userId: string): Promise<void> {
    this.carts[userId] = [];
  }
}

// Instanciar repositorios y casos de uso
const bookRepository = new InMemoryBookRepository();
const userRepository = new InMemoryUserRepository();
const authorRepository = new InMemoryAuthorRepository();
const orderRepository = new InMemoryOrderRepository();
const cartRepository = new InMemoryCartRepository();

const bookUseCase = new BookUseCase(bookRepository);
const cartUseCase = new CartUseCase(cartRepository);
const orderUseCase = new OrderUseCase(orderRepository, bookRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);
const authorUseCase = new AuthorUseCase(authorRepository);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoints para usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const user = await createUserUseCase.execute(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al crear usuario" });
  }
});

app.put("/api/usuarios/:id", async (req, res) => {
  try {
    const user = await updateUserUseCase.execute(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al actualizar usuario" });
  }
});

app.delete("/api/usuarios/:id", async (req, res) => {
  try {
    await deleteUserUseCase.execute(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al eliminar usuario" });
  }
});

// Endpoint para libros
app.get("/api/libros", async (req, res) => {
  const books = await bookUseCase.getAllBooks();
  res.json(books);
});

// Endpoint para autores
app.get("/api/autores", async (req, res) => {
  const authors = await authorUseCase.getAllAuthors();
  res.json(authors);
});

// Endpoints para carrito
app.get("/api/carrito/:userId", async (req, res) => {
  try {
    const items = await cartUseCase.getCartItems(req.params.userId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

app.post("/api/carrito/:userId", async (req, res) => {
  try {
    const { libro, cantidad } = req.body;
    await cartUseCase.addBookToCart(req.params.userId, libro, cantidad);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al agregar libro al carrito" });
  }
});

app.delete("/api/carrito/:userId/:bookId", async (req, res) => {
  try {
    await cartUseCase.removeBookFromCart(req.params.userId, req.params.bookId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al eliminar libro del carrito" });
  }
});

// Endpoints para órdenes
app.post("/api/ordenes", async (req, res) => {
  try {
    const { usuario, items } = req.body;
    const order = await orderUseCase.processNewOrder(usuario, items);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al procesar la orden" });
  }
});

app.get("/api/ordenes/usuario/:userId", async (req, res) => {
  try {
    const orders = await orderUseCase.getUserOrders(req.params.userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener órdenes del usuario" });
  }
});

app.patch("/api/ordenes/:orderId/estado", async (req, res) => {
  try {
    const { estado } = req.body;
    const order = await orderUseCase.updateOrderStatus(req.params.orderId, estado);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Error al actualizar estado de la orden" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});