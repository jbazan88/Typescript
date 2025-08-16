import { OrderRepository } from "../repositories/OrderRepository";

export  const mockOrderRepository: jest.Mocked<OrderRepository> = {
    save: jest.fn(),
    findById: jest.fn(),
    findByUser: jest.fn(),
    updateStatus: jest.fn(),
    findByStatus: jest.fn(),
};