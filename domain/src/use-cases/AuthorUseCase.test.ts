import { AuthorUseCase } from "./AuthorUseCase";
import { AuthorRepository } from "../repositories/AuthorRepository";
import { Author } from "../entities/Author";
import { mockAuthorRepository } from "../mocks/MockAuthor";

describe("AuthorUseCase", () => {
  let authorUseCase: AuthorUseCase;

  beforeEach(() => {
    authorUseCase = new AuthorUseCase(mockAuthorRepository);
    jest.clearAllMocks();
  });

  describe("getAllAuthors", () => {
    it("should return all authors", async () => {
        const mockAuthors: Partial<Author>[] = [
        {
          id: "1",
          nombre: "Gabriel García Márquez",
          biografia: "Escritor colombiano",
          fechaNacimiento: new Date("1927-03-06"),
        },
        {
          id: "2",
          nombre: "Isabel Allende",
          biografia: "Escritora chilena",
          fechaNacimiento: new Date("1942-08-02"),
        },
      ];

      mockAuthorRepository.findAll.mockResolvedValue(mockAuthors);

      const result = await authorUseCase.getAllAuthors();

      expect(mockAuthorRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAuthors);
    });

    it("should handle repository errors", async () => {
      mockAuthorRepository.findAll.mockRejectedValue(new Error("Database error"));

      await expect(authorUseCase.getAllAuthors()).rejects.toThrow("Database error");
    });
  });

  describe("getAuthorById", () => {
    it("should return author by id", async () => {
      const authorId = "1";
      const mockAuthor: Partial<Author> = {
        id: authorId,
        nombre: "Gabriel García Márquez",
        biografia: "Escritor colombiano",
        fechaNacimiento: new Date("1927-03-06"),
      };

      mockAuthorRepository.findById.mockResolvedValue(mockAuthor);

      const result = await authorUseCase.getAuthorById(authorId);

      expect(mockAuthorRepository.findById).toHaveBeenCalledWith(authorId);
      expect(result).toEqual(mockAuthor);
    });

    it("should return null when author not found", async () => {
      const authorId = "999";
      mockAuthorRepository.findById.mockResolvedValue(null);

      const result = await authorUseCase.getAuthorById(authorId);

      expect(mockAuthorRepository.findById).toHaveBeenCalledWith(authorId);
      expect(result).toBeNull();
    });

    it("should handle repository errors", async () => {
      const authorId = "1";
      mockAuthorRepository.findById.mockRejectedValue(new Error("Database error"));

      await expect(authorUseCase.getAuthorById(authorId)).rejects.toThrow("Database error");
    });
  });

  describe("createAuthor", () => {
    it("should create author successfully", async () => {
      const newAuthorData: Omit<Author, "id"> = {
        nombre: "Mario Vargas Llosa",
        biografia: "Escritor peruano",
        fechaNacimiento: new Date("1936-03-28"),
      };

      const createdAuthor: Partial<Author> = {
        id: "3",
        ...newAuthorData,
      };

      mockAuthorRepository.create.mockResolvedValue(createdAuthor);

      const result = await authorUseCase.createAuthor(newAuthorData);

      expect(mockAuthorRepository.create).toHaveBeenCalledWith(newAuthorData);
      expect(result).toEqual(createdAuthor);
    });

    it("should handle repository creation errors", async () => {
      const newAuthorData: Omit<Author, "id"> = {
        nombre: "Mario Vargas Llosa",
        biografia: "Escritor peruano",
        fechaNacimiento: new Date("1936-03-28"),
      };

      mockAuthorRepository.create.mockRejectedValue(new Error("Database error"));

      await expect(authorUseCase.createAuthor(newAuthorData)).rejects.toThrow("Database error");
    });
  });

  describe("updateAuthor", () => {
    it("should update author successfully", async () => {
      const authorId = "1";
      const updateData: Partial<Omit<Author, "id">> = {
        nombre: "Gabriel García Márquez Updated",
        biografia: "Escritor colombiano ganador del Nobel",
      };

      const updatedAuthor: Partial<Author> = {
        id: authorId,
        nombre: "Gabriel García Márquez Updated",
        biografia: "Escritor colombiano ganador del Nobel",
        fechaNacimiento: new Date("1927-03-06"),
      };

      mockAuthorRepository.update.mockResolvedValue(updatedAuthor);

      const result = await authorUseCase.updateAuthor(authorId, updateData);

      expect(mockAuthorRepository.update).toHaveBeenCalledWith(authorId, updateData);
      expect(result).toEqual(updatedAuthor);
    });

    it("should handle repository update errors", async () => {
      // Arrange
      const authorId = "1";
      const updateData: Partial<Omit<Author, "id">> = {
        nombre: "Updated Name",
      };

      mockAuthorRepository.update.mockRejectedValue(new Error("Author not found"));

      await expect(authorUseCase.updateAuthor(authorId, updateData)).rejects.toThrow(
        "Author not found"
      );
    });

    it("should update with partial data", async () => {
      const authorId = "1";
      const updateData: Partial<Omit<Author, "id">> = {
        biografia: "Nueva biografía solamente",
      };

      const updatedAuthor: Partial<Author> = {
        id: authorId,
        nombre: "Gabriel García Márquez",
        biografia: "Nueva biografía solamente",
        fechaNacimiento: new Date("1927-03-06"),
      };

      mockAuthorRepository.update.mockResolvedValue(updatedAuthor);

      const result = await authorUseCase.updateAuthor(authorId, updateData);

      expect(mockAuthorRepository.update).toHaveBeenCalledWith(authorId, updateData);
      expect(result).toEqual(updatedAuthor);
    });
  });

  describe("deleteAuthor", () => {
    it("should delete author successfully", async () => {
      const authorId = "1";
      mockAuthorRepository.delete.mockResolvedValue();

      const result = await authorUseCase.deleteAuthor(authorId);

      expect(mockAuthorRepository.delete).toHaveBeenCalledWith(authorId);
      expect(result).toBeUndefined();
    });

    it("should handle repository deletion errors", async () => {
      const authorId = "1";
      mockAuthorRepository.delete.mockRejectedValue(new Error("Author not found"));

      await expect(authorUseCase.deleteAuthor(authorId)).rejects.toThrow("Author not found");
    });

    it("should handle non-existent author deletion", async () => {
      const authorId = "999";
      mockAuthorRepository.delete.mockRejectedValue(new Error("Author not found"));

      await expect(authorUseCase.deleteAuthor(authorId)).rejects.toThrow("Author not found");
    });
  });
});