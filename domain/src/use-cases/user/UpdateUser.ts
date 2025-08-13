import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { Password } from "../../utils/Password";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    userId: string,
    updateData: Partial<Pick<User, "name" | "email" | "password" | "role">>
  ): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new Error("Usuario no encontrado para actualizar.");
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(updateData.email);
      if (userWithSameEmail) {
        throw new Error("Ya existe otro usuario con este correo electrónico.");
      }
    }

    const dataToUpdate: Partial<User> = { id: userId, ...updateData };
    if (updateData.password) {
      const passwordHash = await Password.create(updateData.password);
      dataToUpdate.password = passwordHash.toString();
    }

    const updatedUser = await this.userRepository.update(dataToUpdate);

    console.log(`Usuario con ID ${userId} actualizado exitosamente.`);

    return updatedUser;
  }
}