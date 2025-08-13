import { Book } from "../entities/Book";
import { Cart } from "../entities/Cart";
import { CartRepository } from "../repositories/CartRepository";

export class CartUseCase {
  constructor(private cartRepository: CartRepository) {}

  async addBookToCart(userId: string, book: Book, cantidad: number): Promise<void> {
    if (cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0.");
    const items = await this.cartRepository.getCart(userId);
    const existingItem = items.find(item => item.libro.id === book.id);
    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      items.push({ libro: book, cantidad });
    }
    await this.cartRepository.saveCart(userId, items);
  }

  async removeBookFromCart(userId: string, bookId: string): Promise<void> {
    const items = await this.cartRepository.getCart(userId);
    const index = items.findIndex(item => item.libro.id === bookId);
    if (index !== -1) {
      items.splice(index, 1);
      await this.cartRepository.saveCart(userId, items);
    } else {
      throw new Error("El libro no se encontró en el carrito.");
    }
  }

  async getCartItems(userId: string): Promise<Cart[]> {
    return this.cartRepository.getCart(userId);
  }

  async getCartTotal(userId: string): Promise<number> {
    const items = await this.cartRepository.getCart(userId);
    return items.reduce((total, item) => total + (item.libro.precio * item.cantidad), 0);
  }
}