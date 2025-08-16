import { DeleteUserUseCase } from "./DeleteUser";
import { mockUserRepository } from "../../mocks/MockUser";

describe("DeleteUserUseCase", () => {
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
    jest.clearAllMocks();
  });

  it("should delete user successfully", async () => {
    mockUserRepository.findById.mockResolvedValue({ id: "user1" });
    mockUserRepository.delete.mockResolvedValue();

    await expect(deleteUserUseCase.execute("user1")).resolves.toBeUndefined();
    expect(mockUserRepository.findById).toHaveBeenCalledWith("user1");
    expect(mockUserRepository.delete).toHaveBeenCalledWith("user1");
  });

  it("should throw error when user not found", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute("user1")).rejects.toThrow(
      "Usuario no encontrado para eliminar."
    );
    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});