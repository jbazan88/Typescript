import { BookRepository } from "../repositories/BookRepository";
import { Book } from "../entities/Book";

export const mockBookRepository: jest.Mocked<BookRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  verifyStock: jest.fn(),
  updateStock: jest.fn(),
};