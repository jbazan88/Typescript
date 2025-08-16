import { CartUseCase } from "./CartUseCase";
import { Book } from "../entities/Book";
import { mockCartRepository } from "../mocks/MockCart";
import { Cart } from "../entities/Cart";

describe("CartUseCase", () => {
  let cartUseCase: CartUseCase;

  const book1: Book = { id: "1", titulo: "El Quijote", autorId: "Cervantes", precio: 25, stock: 10 };
  const userId = "user-123";

  beforeEach(() => {
    cartUseCase = new CartUseCase(mockCartRepository);
    
    mockCartRepository.getCart.mockReset();
    mockCartRepository.saveCart.mockReset();
  });

  describe("addBookToCart", () => {
    it("debe agregar un nuevo libro al carrito", async () => {
      mockCartRepository.getCart.mockResolvedValue([]);
      
      await cartUseCase.addBookToCart(userId, book1, 1);
      
      expect(mockCartRepository.saveCart).toHaveBeenCalledWith(userId, [{ libro: book1, cantidad: 1 }]);
    });

    it("debe incrementar la cantidad si el libro ya está en el carrito", async () => {
      const existingCart: Cart[] = [{ libro: book1, cantidad: 1 }];
      mockCartRepository.getCart.mockResolvedValue(existingCart);

      await cartUseCase.addBookToCart(userId, book1, 2);
      
      expect(mockCartRepository.saveCart).toHaveBeenCalledWith(userId, [{ libro: book1, cantidad: 3 }]);
    });

    it("debe lanzar un error si la cantidad es cero o negativa", async () => {
      await expect(cartUseCase.addBookToCart(userId, book1, 0)).rejects.toThrow("La cantidad debe ser mayor a 0.");
    });
  });

  describe("removeBookFromCart", () => {
    it("debe eliminar un libro del carrito", async () => {
      const existingCart: Cart[] = [{ libro: book1, cantidad: 1 }];
      mockCartRepository.getCart.mockResolvedValue(existingCart);
      
      await cartUseCase.removeBookFromCart(userId, book1.id);

      expect(mockCartRepository.saveCart).toHaveBeenCalledWith(userId, []);
    });

    it("debe lanzar un error si el libro no está en el carrito", async () => {
      mockCartRepository.getCart.mockResolvedValue([]);
      
      await expect(cartUseCase.removeBookFromCart(userId, "non-existent-id")).rejects.toThrow("El libro no se encontró en el carrito.");
    });
  });

  describe("getCartItems", () => {
    it("debe devolver el contenido actual del carrito", async () => {
      const existingCart: Cart[] = [{ libro: book1, cantidad: 2 }];
      mockCartRepository.getCart.mockResolvedValue(existingCart);
      
      const items = await cartUseCase.getCartItems(userId);

      expect(items).toEqual(existingCart);
    });
  });
});