import { UserRepository } from "../../repositories/UserRepository";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const userToDelete = await this.userRepository.findById(userId);
    if (!userToDelete) {
      throw new Error("Usuario no encontrado para eliminar.");
    }

    await this.userRepository.delete(userId);
    
    console.log(`Usuario con ID ${userId} eliminado.`);
  }
}