import { User } from "../entities/User";

export interface UserRepository {
    findAll() : Promise<Partial<User>[]>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<Partial<User> | null>;
    create(user: Pick<User, "name" | "email" | "password" | "role">): Promise<Partial<User>>;
    update(user: Partial<User>): Promise<Partial<User>>;
    delete(id: string): Promise<void>;
    }