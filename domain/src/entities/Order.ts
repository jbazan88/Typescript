import { Cart } from "./Cart";
import { User } from "./User";

export type OrderStatus = "pendiente" | "enviado" | "cancelado";

export interface Order {
  id: string;
  usuario: User;
  items: Cart[];
  total: number;
  fecha: Date;
  estado: OrderStatus,
}