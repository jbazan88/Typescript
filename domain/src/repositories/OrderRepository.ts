import { Order, OrderStatus } from "../entities/Order";

export interface OrderRepository {
  /**
   * Guarda una nueva orden de compra.
   * @param order La orden a guardar.
   */
  save(order: Omit<Order, "id" | "fecha">): Promise<Order>;

  /**
   * Busca una orden por su ID.
   * @param id El ID de la orden.
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Lista todas las órdenes de un usuario.
   * @param usuarioId El ID del usuario.
   */
  findByUser(usuarioId: string): Promise<Order[]>;

  /**
   * Actualiza el estado de una orden.
   * @param id El ID de la orden.
   * @param newStatus El nuevo estado de la orden.
   */
  updateStatus(id: string, newStatus: OrderStatus): Promise<Order>;

  /**
   * Busca todas las órdenes por su estado.
   * @param status El estado de la orden.
   */
  findByStatus(status: OrderStatus): Promise<Order[]>;
}