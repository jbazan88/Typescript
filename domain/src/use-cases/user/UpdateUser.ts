import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { Password } from "../../utils/Password";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    userId: string, 
    updateData: Partial<Pick<User, "name" | "email" | "password" | "role">>
  ): Promise<Partial<User>> {
    // Verificar si el usuario existe
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error("Usuario no encontrado para actualizar.");
    }

    // Si se está actualizando el email, verificar que no esté en uso
    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(updateData.email);
      if (userWithSameEmail) {
        throw new Error("Ya existe otro usuario con este correo electrónico.");
      }
    }

    // Si se está actualizando la contraseña, crear el hash
    const dataToUpdate = { ...updateData };
    if (updateData.password) {
      const passwordHash = await Password.create(updateData.password);
      dataToUpdate.password = passwordHash.toString();
    }

    // Actualizar el usuario
    const updatedUser = await this.userRepository.update(userId, dataToUpdate);
    console.log(`Usuario con ID ${userId} actualizado exitosamente.`);
    
    return updatedUser;
  }
}