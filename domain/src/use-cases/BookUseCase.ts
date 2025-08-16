import { Book } from "../entities/Book";
import { BookRepository } from "../repositories/BookRepository";

export class BookUseCase {
  constructor(private bookRepository: BookRepository) {}

  async getAllBooks() {
    return this.bookRepository.findAll();
  }

  async getBookById(id: string) {
    return this.bookRepository.findById(id);
  }

  async createBook(bookData: Omit<Book, "id">) {
    return this.bookRepository.create(bookData);
  }

  async updateBook(id: string, updateData: Partial<Omit<Book, "id">>) {
    return this.bookRepository.update(id, updateData);
  }

  async deleteBook(id: string) {
    return this.bookRepository.delete(id);
  }
}