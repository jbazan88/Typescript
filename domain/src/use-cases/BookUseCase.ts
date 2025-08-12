import { BookRepository } from "../repositories/BookRepository";

export class BookUseCase {
  constructor(private bookRepository: BookRepository) {}

  async getAllBooks() {
    return this.bookRepository.findAll();
  }
}