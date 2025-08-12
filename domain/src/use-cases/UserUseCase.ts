import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserAdminUseCase {
  constructor(private userRepository: UserRepository) {}

  async createNewUser(newUser: Pick<User, "name" | "email" | "password" | "role">): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findByEmail(newUser.email);
    if (existingUser) {
      throw new Error("Ya existe un usuario con este correo electrónico.");
    }
    const createdUser = await this.userRepository.create(newUser);
    console.log(`Usuario ${createdUser.name} creado con éxito con rol ${createdUser.role}.`);
    return createdUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const userToDelete = await this.userRepository.findById(userId);
    if (!userToDelete) {
      throw new Error("Usuario no encontrado para eliminar.");
    }
    await this.userRepository.delete(userId);
    console.log(`Usuario con ID ${userId} eliminado.`);
  }

  async getAllUsers(): Promise<Partial<User>[]> {
    return this.userRepository.findAll();
  }
}