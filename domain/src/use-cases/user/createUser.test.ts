import { CreateUserUseCase } from "./CreateUser";
import { User, Role } from "../../entities/User";
import { mockUserRepository } from "../../mocks/MockUser";
import { MockedPassword } from "../../mocks/MockPassword";

jest.mock("../../utils/Password");

describe("CreateUserUseCase", () => {
  let createUserUseCase: CreateUserUseCase;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(mockUserRepository);
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("execute", () => {
    const newUserData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user" as const,
    };

    const mockPasswordHash = {
      toString: () => "hashedPassword123",
    };

    const mockCreatedUser: User = {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedPassword123",
      role: "user",
    };

    const mockCreatedAdmin: User = {
      ...mockCreatedUser,
      role: "admin",
    };

    it("should create a new user successfully", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      MockedPassword.create.mockResolvedValue(mockPasswordHash as any);
      mockUserRepository.create.mockResolvedValue(mockCreatedUser);

      const result = await createUserUseCase.execute(newUserData);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(MockedPassword.create).toHaveBeenCalledWith("password123");
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword123",
        role: "user",
      });
      expect(result).toEqual(mockCreatedUser);
      expect(consoleLogSpy).toHaveBeenCalledWith("Usuario John Doe creado con éxito con rol user.");
    });

    it("should throw error when user with email already exists", async () => {
      const existingUser: User = {
        id: "existing1",
        name: "Existing User",
        email: "john@example.com",
        password: "hashedPassword",
        role: "user",
      };
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      await expect(createUserUseCase.execute(newUserData)).rejects.toThrow(
        "Ya existe un usuario con este correo electrónico."
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("john@example.com");
      expect(MockedPassword.create).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it("should create admin user successfully", async () => {
      const adminUserData = {
        ...newUserData,
        role: "admin" as const,
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      MockedPassword.create.mockResolvedValue(mockPasswordHash as any);
      mockUserRepository.create.mockResolvedValue(mockCreatedAdmin);

      const result = await createUserUseCase.execute(adminUserData);

      expect(result).toEqual(mockCreatedAdmin);
      expect(consoleLogSpy).toHaveBeenCalledWith("Usuario John Doe creado con éxito con rol admin.");
    });

    it("should handle password hashing errors", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      MockedPassword.create.mockRejectedValue(new Error("Password hashing failed"));

      await expect(createUserUseCase.execute(newUserData)).rejects.toThrow("Password hashing failed");
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it("should handle repository creation errors", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      MockedPassword.create.mockResolvedValue(mockPasswordHash as any);
      mockUserRepository.create.mockRejectedValue(new Error("Database error"));

      await expect(createUserUseCase.execute(newUserData)).rejects.toThrow("Database error");
    });
  });
});