import { User } from "../entities/User";

export class Auth {
  static verificarRol(usuario: User, rolRequerido: string): boolean {
    return usuario.role === rolRequerido;
  }

  static generarToken(usuario: User): string {
    if (!usuario.email || !usuario.role) {
      throw new Error("Usuario no válido para generar token");
    }
    return Buffer.from(`${usuario.email}:${usuario.role}`).toString('base64');
  }
}