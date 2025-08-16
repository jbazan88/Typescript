import { OrderUseCase } from "./OrderUseCase";
import { OrderStatus } from "../entities/Order";
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { Book } from "../entities/Book";
import { mockOrderRepository } from "../mocks/MockOrder";
import { mockBookRepository } from "../mocks/MockBook";

describe("OrderUseCase", () => {
  let orderUseCase: OrderUseCase;

  const user: User = { id: "user-1", name: "John Doe", email: "john@test.com", password: "123", role: "user" };
  const book1: Book = { id: "book-1", titulo: "Libro con stock", autorId: "Autor 1", precio: 10, stock: 5 };
  const newOrder = { id: "order-1", total: 20, estado: "pendiente" as OrderStatus, usuario: user, items: [{ libro: book1, cantidad: 2 }], fecha: new Date() };

  beforeEach(() => {
    orderUseCase = new OrderUseCase(mockOrderRepository, mockBookRepository);

    mockOrderRepository.save.mockReset();
    mockBookRepository.findById.mockReset();
    mockBookRepository.update.mockReset();
  });

  describe("processNewOrder", () => {
    it("debe procesar una orden exitosamente y descontar el stock", async () => {
      const cart: Cart[] = [{ libro: book1, cantidad: 2 }];

      mockBookRepository.findById.mockResolvedValue(book1);
      mockOrderRepository.save.mockResolvedValue(newOrder);

      const order = await orderUseCase.processNewOrder(user, cart);

      expect(mockBookRepository.findById).toHaveBeenCalledWith(book1.id);
      expect(mockBookRepository.update).toHaveBeenCalledWith({ ...book1, stock: 3 });
      expect(mockOrderRepository.save).toHaveBeenCalled();
      expect(order).toEqual(newOrder);
    });

    it("debe lanzar un error si el carrito está vacío", async () => {
      const emptyCart: Cart[] = [];
      await expect(orderUseCase.processNewOrder(user, emptyCart)).rejects.toThrow("El carrito está vacío. No se puede procesar la orden.");
    });
  });
});