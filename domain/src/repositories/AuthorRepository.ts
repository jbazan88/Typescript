import { Author } from "../entities/Author";

export interface AuthorRepository {
  findAll(): Promise<Partial<Author>[]>;
  findById(id: string): Promise<Partial<Author> | null>;
  create(author: Omit<Author, "id">): Promise<Partial<Author>>;
  update(author: Partial<Author>): Promise<Partial<Author>>;
  delete(id: string): Promise<void>;
}