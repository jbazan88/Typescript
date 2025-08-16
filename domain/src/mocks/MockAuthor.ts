import { AuthorRepository } from "../repositories/AuthorRepository";
import { Author } from "../entities/Author";

export const mockAuthorRepository: jest.Mocked<AuthorRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};