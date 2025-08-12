import { Book } from "../entities/Book";
import { CartUseCase } from "./CartUseCase";

describe("CartUseCase", () => {
  let cartUseCase: CartUseCase;
  const book1: Book = { id: "1", titulo: "El Quijote", autorId: "Cervantes", precio: 25, stock: 10 };
  const book2: Book = { id: "2", titulo: "La Odisea", autorId: "Homero", precio: 20, stock: 5 };

  beforeEach(() => {
    cartUseCase = new CartUseCase();
  });

  describe("addBookToCart", () => {
    it("debe agregar un nuevo libro al carrito", () => {
      // Act
      cartUseCase.addBookToCart(book1, 1);
      const items = cartUseCase.getCartItems();

      // Assert
      expect(items.length).toBe(1);
      expect(items[0]).toEqual({ libro: book1, cantidad: 1 });
    });

    it("debe incrementar la cantidad si el libro ya está en el carrito", () => {
      // Arrange
      cartUseCase.addBookToCart(book1, 1);
      
      // Act
      cartUseCase.addBookToCart(book1, 2);
      const items = cartUseCase.getCartItems();

      // Assert
      expect(items.length).toBe(1);
      expect(items[0].cantidad).toBe(3);
    });

    it("debe lanzar un error si la cantidad es cero o negativa", () => {
      // Act & Assert
      expect(() => cartUseCase.addBookToCart(book1, 0)).toThrow("La cantidad debe ser mayor a 0.");
      expect(() => cartUseCase.addBookToCart(book1, -1)).toThrow("La cantidad debe ser mayor a 0.");
    });
  });

  describe("removeBookFromCart", () => {
    it("debe eliminar un libro del carrito", () => {
      // Arrange
      cartUseCase.addBookToCart(book1, 1);
      
      // Act
      cartUseCase.removeBookFromCart(book1.id);

      // Assert
      expect(cartUseCase.getCartItems()).toEqual([]);
    });

    it("debe lanzar un error si el libro no está en el carrito", () => {
      // Act & Assert
      expect(() => cartUseCase.removeBookFromCart("non-existent-id")).toThrow("El libro no se encontró en el carrito.");
    });
  });

  describe("getCartTotal", () => {
    it("debe devolver 0 para un carrito vacío", () => {
      // Act & Assert
      expect(cartUseCase.getCartTotal()).toBe(0);
    });

    it("debe calcular el total correctamente", () => {
      // Arrange
      cartUseCase.addBookToCart(book1, 2); // 2 * 25 = 50
      cartUseCase.addBookToCart(book2, 3); // 3 * 20 = 60
      
      // Act & Assert
      expect(cartUseCase.getCartTotal()).toBe(110);
    });
  });
});