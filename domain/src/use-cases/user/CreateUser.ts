import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepository";
import { Password } from "../../utils/Password";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(newUser: Pick<User, "name" | "email" | "password" | "role">): Promise<Partial<User>> {
    const existingUser = await this.userRepository.findByEmail(newUser.email);
    if (existingUser) {
      throw new Error("Ya existe un usuario con este correo electrónico.");
    }

    const passwordHash = await Password.create(newUser.password);

    const createdUser = await this.userRepository.create({
      ...newUser,
      password: passwordHash.toString(),
    });

    console.log(`Usuario ${createdUser.name} creado con éxito con rol ${createdUser.role}.`);

    return createdUser;
  }
}