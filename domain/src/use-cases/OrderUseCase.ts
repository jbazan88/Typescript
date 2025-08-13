import { Order, OrderStatus } from "../entities/Order";
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { OrderRepository } from "../repositories/OrderRepository";
import { BookRepository } from "../repositories/BookRepository";

export class OrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private bookRepository: BookRepository
  ) {}

  async processNewOrder(user: User, cart: Cart[]): Promise<Order> {
    if (cart.length === 0) {
      throw new Error("El carrito está vacío. No se puede procesar la orden.");
    }

    for (const item of cart) {
      const bookInDB = await this.bookRepository.findById(item.libro.id);
      if (!bookInDB || (bookInDB.stock ?? 0) < item.cantidad) {
        throw new Error(`Stock insuficiente para el libro "${item.libro.titulo}".`);
      }
    }

    let orderTotal = 0;
    for (const item of cart) {
      const bookInDB = await this.bookRepository.findById(item.libro.id);
      if (bookInDB) {
        await this.bookRepository.update({
          ...bookInDB,
          stock: (bookInDB.stock ?? 0) - item.cantidad,
        });
        orderTotal += item.libro.precio * item.cantidad;
      }
    }

    const newOrder = await this.orderRepository.save({
      usuario: user,
      items: cart,
      total: orderTotal,
      estado: "pendiente",
    });

    return newOrder;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    return this.orderRepository.updateStatus(orderId, newStatus);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.findByUser(userId);
  }
}