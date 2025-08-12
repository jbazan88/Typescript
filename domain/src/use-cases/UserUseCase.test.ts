import { User, Role } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { UserAdminUseCase } from "./UserUseCase";

// Mock del UserRepository
const mockUserRepository: jest.Mocked<UserRepository> = {
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Limpiar mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
});

describe("UserAdminUseCase", () => {
  const userAdminUseCase = new UserAdminUseCase(mockUserRepository);

  describe("createNewUser", () => {
    it("debe crear un usuario si el email no existe", async () => {
      const newUser: Pick<User, "name" | "email" | "password" | "role"> = {
        name: "Juan Perez",
        email: "juan.perez@example.com",
        password: "password123",
        role: "user",
      };

      // Arrange: Simular que no se encuentra un usuario y que la creación es exitosa
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({ id: "1", ...newUser });

      // Act
      const result = await userAdminUseCase.createNewUser(newUser);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(newUser.email);
      expect(mockUserRepository.create).toHaveBeenCalledWith(newUser);
      expect(result.email).toBe(newUser.email);
      expect(result).toHaveProperty("id");
    });

    it("debe lanzar un error si el usuario ya existe", async () => {
      const existingUser: User = {
        id: "1",
        name: "Ana Gomez",
        email: "ana.gomez@example.com",
        password: "password123",
        role: "user",
      };

      // Arrange: Simular que el usuario ya existe
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userAdminUseCase.createNewUser({
        name: "Nuevo Nombre",
        email: existingUser.email, // email repetido
        password: "newpassword",
        role: "user",
      })).rejects.toThrow("Ya existe un usuario con este correo electrónico.");

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    it("debe eliminar un usuario si el ID existe", async () => {
      const userId = "1";
      // Arrange: Simular que el usuario existe
      mockUserRepository.findById.mockResolvedValue({ id: userId, name: "Test User" });
      mockUserRepository.delete.mockResolvedValue();

      // Act
      await userAdminUseCase.deleteUser(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it("debe lanzar un error si el usuario a eliminar no se encuentra", async () => {
      const userId = "non-existent-id";
      // Arrange: Simular que el usuario no existe
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userAdminUseCase.deleteUser(userId)).rejects.toThrow("Usuario no encontrado para eliminar.");
      expect(mockUserRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("getAllUsers", () => {
    it("debe devolver una lista de todos los usuarios", async () => {
      const users: Partial<User>[] = [
        { id: "1", name: "Usuario 1" },
        { id: "2", name: "Usuario 2" },
      ];
      // Arrange
      mockUserRepository.findAll.mockResolvedValue(users);

      // Act
      const result = await userAdminUseCase.getAllUsers();

      // Assert
      expect(result).toEqual(users);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});