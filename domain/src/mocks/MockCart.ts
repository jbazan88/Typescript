import { CartRepository } from "../repositories/CartRepository";

export  const mockCartRepository: jest.Mocked<CartRepository> = {
      getCart: jest.fn(),
      saveCart: jest.fn(),
      clearCart: jest.fn(),
      };