import { Cart } from "../entities/Cart";

export interface CartRepository {
  getCart(userId: string): Promise<Cart[]>;
  saveCart(userId: string, items: Cart[]): Promise<void>;
  clearCart(userId: string): Promise<void>;
}