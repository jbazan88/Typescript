import { UpdateUserUseCase } from "./UpdateUser";
import { User } from "../../entities/User";
import { mockUserRepository } from "../../mocks/MockUser";
import { MockedPassword } from "../../mocks/MockPassword";

jest.mock("../../utils/Password");

describe("UpdateUserUseCase", () => {
  let updateUserUseCase: UpdateUserUseCase;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("execute", () => {
    const userId = "user1";
    const existingUser: Partial<User> = {
      id: userId,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
    };

    const updatedUser: Partial<User> = {
      id: userId,
      name: "John Updated",
      email: "john.updated@example.com",
      role: "admin",
    };

    it("should update user successfully without password change", async () => {
      const updateData = {
        name: "John Updated",
        email: "john.updated@example.com",
        role: "admin" as const,
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await updateUserUseCase.execute(userId, updateData);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("john.updated@example.com");
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(updatedUser);
      expect(consoleLogSpy).toHaveBeenCalledWith(`Usuario con ID ${userId} actualizado exitosamente.`);
    });

    it("should update user successfully with password change", async () => {
      const updateData = {
        name: "John Updated",
        password: "newPassword123",
      };

      const mockPasswordHash = {
        toString: () => "hashedNewPassword123",
      };

      const expectedUpdateData = {
        name: "John Updated",
        password: "hashedNewPassword123",
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      MockedPassword.create.mockResolvedValue(mockPasswordHash as any);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await updateUserUseCase.execute(userId, updateData);

      expect(MockedPassword.create).toHaveBeenCalledWith("newPassword123");
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, expectedUpdateData);
      expect(result).toEqual(updatedUser);
    });

    it("should throw error when user not found", async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(updateUserUseCase.execute(userId, { name: "New Name" })).rejects.toThrow(
        "Usuario no encontrado para actualizar."
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it("should throw error when email already exists for another user", async () => {
      const updateData = { email: "existing@example.com" };
      const anotherUser: User = {
        id: "user2",
        name: "Another User",
        email: "existing@example.com",
        password: "hashedPassword",
        role: "user",
      };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.findByEmail.mockResolvedValue(anotherUser);

      await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
        "Ya existe otro usuario con este correo electrónico."
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it("should allow updating to same email", async () => {
      const updateData = { email: "john@example.com", name: "John Updated" };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await updateUserUseCase.execute(userId, updateData);

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(updatedUser);
    });

    it("should handle password hashing errors", async () => {
      const updateData = { password: "newPassword123" };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      MockedPassword.create.mockRejectedValue(new Error("Password hashing failed"));

      await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow(
        "Password hashing failed"
      );
      expect(mockUserRepository.update).not.toHaveBeenCalled();
    });

    it("should handle repository update errors", async () => {
      const updateData = { name: "John Updated" };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockRejectedValue(new Error("Database error"));

      await expect(updateUserUseCase.execute(userId, updateData)).rejects.toThrow("Database error");
    });

    it("should update only provided fields", async () => {
      const updateData = { name: "Only Name Updated" };

      mockUserRepository.findById.mockResolvedValue(existingUser);
      mockUserRepository.update.mockResolvedValue(updatedUser);

      await updateUserUseCase.execute(userId, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, { name: "Only Name Updated" });
    });
  });
});