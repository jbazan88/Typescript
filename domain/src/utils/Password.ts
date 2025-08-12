import * as bcrypt from 'bcrypt';

export class Password {
  private constructor(private readonly hash: string) {}

  static async create(plainPassword: string): Promise<Password> {
    if (plainPassword.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }
    const hash = await bcrypt.hash(plainPassword, 10);
    return new Password(hash);
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hash);
  }

  toString(): string {
    return this.hash;
  }
}