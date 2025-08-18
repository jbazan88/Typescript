import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import UserModel from "../models/userModel";
import RoleModel from "../models/roleModel";

const createBadRequestError = (message: string) => {
  const error = new Error(message);
  error.name = 'BadRequestError';
  return error;
};

const createNotFoundError = (message: string) => {
  const error = new Error(message);
  error.name = 'NotFoundError';
  return error;
};

export const userRepository: UserRepository = {
  findAll: async function (): Promise<Partial<User>[]> {
    const users = await UserModel.findAll({ 
      include: [{
        model: RoleModel,
        as: 'role'
      }]
    });
    
    return users.map(user => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role?.name === 'admin' ? 'admin' : 'user'
    }));
  },

  findByEmail: async function (email: string): Promise<User | null> {
    if (!email) return null;
    
    const user = await UserModel.findOne({ 
      where: { email }, 
      include: [{
        model: RoleModel,
        as: 'role'
      }]
    });
    
    return user ? {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role?.name === 'admin' ? 'admin' : 'user'
    } : null;
  },

  findById: async function (id: string): Promise<Partial<User> | null> {
    if (!id) return null;
    
    const user = await UserModel.findByPk(id, { 
      include: [{
        model: RoleModel,
        as: 'role'
      }]
    });
    
    if (!user) return null;
    
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role?.name === 'admin' ? 'admin' : 'user'
    };
  },

  create: async function (userData: Pick<User, "name" | "email" | "password" | "role">): Promise<Partial<User>> {
    const roleName = userData.role === 'admin' ? 'admin' : 'user';
    const role = await RoleModel.findOne({ where: { name: roleName } });
    
    if (!role) {
      throw createBadRequestError(`El rol '${userData.role}' no existe`);
    }

    const dataToCreate = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      locked: false,
      validated: false,
      rolId: role.id,
    };

    const newUser = await UserModel.create(dataToCreate);
    const userWithRole = await newUser.reload({ 
      include: [{
        model: RoleModel,
        as: 'role'
      }]
    });

    return {
      id: userWithRole.id.toString(),
      name: userWithRole.name,
      email: userWithRole.email,
      role: userWithRole.role?.name === 'admin' ? 'admin' : 'user'
    };
  },

  update: async function (id: string, userData: Partial<User>): Promise<Partial<User>> {
    const userToUpdate = await UserModel.findByPk(id);
    if (!userToUpdate) throw createNotFoundError("No existe un usuario con el ID " + id);

    let updateData: any = {};
    
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.password !== undefined) updateData.password = userData.password;

    if (userData.role !== undefined) {
      const roleName = userData.role === 'admin' ? 'admin' : 'user';
      const role = await RoleModel.findOne({ where: { name: roleName } });
      if (!role) {
        throw createBadRequestError(`El rol '${userData.role}' no existe`);
      }
      updateData.rolId = role.id;
    }

    await userToUpdate.update(updateData);
    const userUpdated = await userToUpdate.reload({ 
      include: [{
        model: RoleModel,
        as: 'role'
      }]
    });

    return {
      id: userUpdated.id.toString(),
      name: userUpdated.name,
      email: userUpdated.email,
      role: userUpdated.role?.name === 'admin' ? 'admin' : 'user'
    };
  },

  delete: async function (id: string): Promise<void> {
    const userToDelete = await UserModel.findByPk(id);
    if (!userToDelete) throw createNotFoundError("No existe un usuario con el ID " + id);
    await userToDelete.destroy();
  },
};

import { CreateUserUseCase } from "../../../domain/use-cases/user/CreateUser";
import { UpdateUserUseCase } from "../../../domain/use-cases/user/UpdateUser";
import { DeleteUserUseCase } from "../../../domain/use-cases/user/DeleteUser";
import { GetUserUseCase } from "../../../domain/use-cases/user/GetUser";
import { GetUsersUseCase } from "../../../domain/use-cases/user/GetUsers";

export const createUserUseCase = new CreateUserUseCase(userRepository);
export const updateUserUseCase = new UpdateUserUseCase(userRepository);
export const deleteUserUseCase = new DeleteUserUseCase(userRepository);
export const getUserUseCase = new GetUserUseCase(userRepository);
export const getUsersUseCase = new GetUsersUseCase(userRepository);