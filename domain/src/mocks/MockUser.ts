import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";

export const mockUserRepository: jest.Mocked<UserRepository> = {
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};