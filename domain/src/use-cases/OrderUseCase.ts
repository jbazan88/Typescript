import { Book } from "../entities/Book";
import { Cart } from "../entities/Cart";
import { Order, OrderStatus } from "../entities/Order";
import { User } from "../entities/User";

export class OrderUseCase {
  private booksDB: Book[] = [];
  private ordersDB: Order[] = [];

  constructor(initialBooks: Book[]) {
    this.booksDB = initialBooks;
  }

  processNewOrder(user: User, cart: Cart[]): Order {
    if (cart.length === 0) {
      throw new Error("El carrito está vacío. No se puede procesar la orden.");
    }

    for (const item of cart) {
      const bookInDB = this.booksDB.find(b => b.id === item.libro.id);
      if (!bookInDB || bookInDB.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el libro "${item.libro.titulo}".`);
      }
    }

    let orderTotal = 0;
    for (const item of cart) {
      const bookInDB = this.booksDB.find(b => b.id === item.libro.id);
      if (bookInDB) {
        bookInDB.stock -= item.cantidad;
        orderTotal += item.libro.precio * item.cantidad;
      }
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      usuario: user,
      items: cart,
      total: orderTotal,
      fecha: new Date(),
      estado: "pendiente",
    };

    this.ordersDB.push(newOrder);

    console.log(`Orden ${newOrder.id} creada con éxito para el usuario ${user.name}.`);
    return newOrder;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    const order = this.ordersDB.find(o => o.id === orderId);
    if (!order) {
      throw new Error("Orden no encontrada.");
    }
    console.log(`Estado de la orden ${orderId} actualizado a ${newStatus}.`);
  }

  getUserOrders(userId: string): Order[] {
    return this.ordersDB.filter(order => order.usuario.id === userId);
  }
}