import { Book } from "../entities/Book";
import { User } from "../entities/User";
import { Cart } from "../entities/Cart";
import { OrderUseCase } from "./OrderUseCase";

describe("OrderUseCase", () => {
  let orderUseCase: OrderUseCase;
  const user: User = { id: "user-1", name: "John Doe", email: "john@test.com", password: "123", role: "user" };
  const book1: Book = { id: "book-1", titulo: "Libro con stock", autorId: "Autor 1", precio: 10, stock: 5 };
  const book2: Book = { id: "book-2", titulo: "Libro sin stock", autorId: "Autor 2", precio: 15, stock: 0 };

  beforeEach(() => {
    // Inicializar con copias de los libros para no afectar otros tests
    const initialBooks = [
      {...book1, stock: 5},
      {...book2, stock: 0}
    ];
    orderUseCase = new OrderUseCase(initialBooks);
  });

  describe("processNewOrder", () => {
    it("debe procesar una orden exitosamente y descontar el stock", () => {
      // Arrange
      const cart: Cart[] = [{ libro: book1, cantidad: 2 }];

      // Act
      const order = orderUseCase.processNewOrder(user, cart);

      // Assert
      expect(order).toBeDefined();
      expect(order.total).toBe(20); // 10 * 2
      expect(order.usuario.id).toBe(user.id);
      expect(order.items[0].cantidad).toBe(2);
      expect(order.estado).toBe("pendiente");

      // Verificar que el stock se descontó
      const bookInDB = orderUseCase['booksDB'].find(b => b.id === book1.id);
      expect(bookInDB?.stock).toBe(3); // 5 - 2
    });

    it("debe lanzar un error si el carrito está vacío", () => {
      // Act & Assert
      expect(() => orderUseCase.processNewOrder(user, [])).toThrow("El carrito está vacío. No se puede procesar la orden.");
    });

    it("debe lanzar un error por stock insuficiente", () => {
      // Arrange
      const cart: Cart[] = [{ libro: book1, cantidad: 10 }]; // Pide 10, solo hay 5

      // Act & Assert
      expect(() => orderUseCase.processNewOrder(user, cart)).toThrow(`Stock insuficiente para el libro "${book1.titulo}".`);
    });
  });

  describe("updateOrderStatus", () => {
    it("debe actualizar el estado de una orden existente", () => {
      // Arrange
      const cart: Cart[] = [{ libro: book1, cantidad: 1 }];
      const order = orderUseCase.processNewOrder(user, cart);

      // Act
      orderUseCase.updateOrderStatus(order.id, "enviado");
      const userOrders = orderUseCase.getUserOrders(user.id);
      
      // Assert
      expect(userOrders[0].estado).toBe("enviado");
    });

    it("debe lanzar un error si la orden no existe", () => {
      // Act & Assert
      expect(() => orderUseCase.updateOrderStatus("non-existent-order", "cancelado")).toThrow("Orden no encontrada.");
    });
  });

  describe("getUserOrders", () => {
    it("debe devolver solo las órdenes del usuario especificado", () => {
      // Arrange
      const anotherUser: User = { id: "user-2", name: "Jane Doe", email: "jane@test.com", password: "123", role: "user" };
      orderUseCase.processNewOrder(user, [{ libro: book1, cantidad: 1 }]);
      orderUseCase.processNewOrder(anotherUser, [{ libro: book1, cantidad: 1 }]);

      // Act
      const orders = orderUseCase.getUserOrders(user.id);

      // Assert
      expect(orders.length).toBe(1);
      expect(orders[0].usuario.id).toBe(user.id);
    });
  });
});