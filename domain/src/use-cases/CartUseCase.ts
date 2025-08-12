import { Book } from "../entities/Book";
import { Cart } from "../entities/Cart";

export class CartUseCase {
  private items: Cart[] = [];

  addBookToCart(book: Book, cantidad: number): void {
    if (cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor a 0.");
    }

    const existingItem = this.items.find(item => item.libro.id === book.id);
    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      this.items.push({ libro: book, cantidad });
    }
    console.log(`Se agregaron ${cantidad} unidades de "${book.titulo}" al carrito.`);
  }

  removeBookFromCart(bookId: string): void {
    const index = this.items.findIndex(item => item.libro.id === bookId);
    if (index !== -1) {
      this.items.splice(index, 1);
      console.log(`Libro con ID ${bookId} eliminado del carrito.`);
    } else {
      throw new Error("El libro no se encontró en el carrito.");
    }
  }

  getCartItems(): Cart[] {
    return this.items;
  }

  getCartTotal(): number {
    return this.items.reduce((total, item) => total + (item.libro.precio * item.cantidad), 0);
  }
}