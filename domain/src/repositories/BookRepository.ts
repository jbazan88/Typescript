import { Book } from "../entities/Book";

export interface BookRepository {
  /**
   * Busca todos los libros.
   */
  findAll(): Promise<Book[]>;

  /**
   * Busca un libro por su ID.
   * @param id El ID del libro.
   */
  findById(id: string): Promise<Book | null>;

  /**
   * Crea un nuevo libro.
   * @param book El objeto libro a crear (sin ID).
   */
  create(book: Omit<Book, 'id'>): Promise<Book>;

  /**
   * Actualiza un libro existente.
   * @param book El objeto libro con las propiedades a actualizar.
   */
  update(book: Partial<Book>): Promise<Book>;

  /**
   * Elimina un libro por su ID.
   * @param id El ID del libro.
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica el stock de un libro.
   * @param id El ID del libro.
   */
  verifyStock(id: string): Promise<boolean>;

  /**
   * Actualiza el stock de un libro.
   * @param id El ID del libro.
   * @param cantidad La cantidad a sumar o restar del stock.
   */
  updateStock(id: string, cantidad: number): Promise<void>;
}