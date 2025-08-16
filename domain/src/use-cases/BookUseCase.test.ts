import { BookUseCase } from "./BookUseCase";
import { BookRepository } from "../repositories/BookRepository";
import { Book } from "../entities/Book";
import { mockBookRepository } from "../mocks/MockBook";

describe("BookUseCase", () => {
  let bookUseCase: BookUseCase;

  beforeEach(() => {
    bookUseCase = new BookUseCase(mockBookRepository);
    jest.clearAllMocks();
  });

  describe("getAllBooks", () => {
    it("should return all books", async () => {
      const mockBooks: Book[] = [
        {
          id: "1",
          titulo: "Cien años de soledad",
          autorId: "author1",
          precio: 25.99,
          stock: 10,
        },
        {
          id: "2",
          titulo: "La casa de los espíritus",
          autorId: "author2",
          precio: 22.50,
          stock: 5,
        },
      ];

      mockBookRepository.findAll.mockResolvedValue(mockBooks);

      const result = await bookUseCase.getAllBooks();

      expect(mockBookRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockBooks);
    });

    it("should return empty array when no books exist", async () => {
      mockBookRepository.findAll.mockResolvedValue([]);

      const result = await bookUseCase.getAllBooks();

      expect(result).toEqual([]);
    });

    it("should handle repository errors", async () => {
      mockBookRepository.findAll.mockRejectedValue(new Error("Database error"));

      await expect(bookUseCase.getAllBooks()).rejects.toThrow("Database error");
    });
  });

  describe("getBookById", () => {
    it("should return book by id", async () => {
      const bookId = "1";
      const mockBook: Book = {
        id: bookId,
        titulo: "Cien años de soledad",
        autorId: "author1",
        precio: 25.99,
        stock: 10,
      };

      mockBookRepository.findById.mockResolvedValue(mockBook);

      const result = await bookUseCase.getBookById(bookId);

      expect(mockBookRepository.findById).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(mockBook);
    });

    it("should return null when book not found", async () => {
      const bookId = "999";
      mockBookRepository.findById.mockResolvedValue(null);

      const result = await bookUseCase.getBookById(bookId);

      expect(mockBookRepository.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBeNull();
    });

    it("should handle repository errors", async () => {
      const bookId = "1";
      mockBookRepository.findById.mockRejectedValue(new Error("Database error"));

      await expect(bookUseCase.getBookById(bookId)).rejects.toThrow("Database error");
    });
  });

  describe("createBook", () => {
    it("should create book successfully", async () => {
      const newBookData: Omit<Book, "id"> = {
        titulo: "El amor en los tiempos del cólera",
        autorId: "author1",
        precio: 28.99,
        stock: 15,
      };

      const createdBook: Book = {
        id: "3",
        ...newBookData,
      };

      mockBookRepository.create.mockResolvedValue(createdBook);

      const result = await bookUseCase.createBook(newBookData);

      expect(mockBookRepository.create).toHaveBeenCalledWith(newBookData);
      expect(result).toEqual(createdBook);
    });

    it("should handle repository creation errors", async () => {
      const newBookData: Omit<Book, "id"> = {
        titulo: "El amor en los tiempos del cólera",
        autorId: "author1",
        precio: 28.99,
        stock: 15,
      };

      mockBookRepository.create.mockRejectedValue(new Error("Database error"));

      await expect(bookUseCase.createBook(newBookData)).rejects.toThrow("Database error");
    });

    it("should create book with zero stock", async () => {
      const newBookData: Omit<Book, "id"> = {
        titulo: "Libro sin stock",
        autorId: "author1",
        precio: 10.00,
        stock: 0,
      };

      const createdBook: Book = {
        id: "4",
        ...newBookData,
      };

      mockBookRepository.create.mockResolvedValue(createdBook);

      const result = await bookUseCase.createBook(newBookData);

      expect(result.stock).toBe(0);
      expect(result).toEqual(createdBook);
    });
  });

  describe("updateBook", () => {
    it("should update book successfully", async () => {
      const bookId = "1";
      const updateData: Partial<Omit<Book, "id">> = {
        titulo: "Cien años de soledad - Edición especial",
        precio: 30.99,
        stock: 20,
      };

      const updatedBook: Book = {
        id: bookId,
        titulo: "Cien años de soledad - Edición especial",
        autorId: "author1",
        precio: 30.99,
        stock: 20,
      };

      mockBookRepository.update.mockResolvedValue(updatedBook);

      const result = await bookUseCase.updateBook(bookId, updateData);

      expect(mockBookRepository.update).toHaveBeenCalledWith(bookId, updateData);
      expect(result).toEqual(updatedBook);
    });

    it("should handle repository update errors", async () => {
      const bookId = "1";
      const updateData: Partial<Omit<Book, "id">> = {
        titulo: "Updated Title",
      };

      mockBookRepository.update.mockRejectedValue(new Error("Book not found"));

      await expect(bookUseCase.updateBook(bookId, updateData)).rejects.toThrow("Book not found");
    });

    it("should update with partial data", async () => {
      const bookId = "1";
      const updateData: Partial<Omit<Book, "id">> = {
        precio: 35.99,
      };

      const updatedBook: Book = {
        id: bookId,
        titulo: "Cien años de soledad",
        autorId: "author1",
        precio: 35.99,
        stock: 10,
      };

      mockBookRepository.update.mockResolvedValue(updatedBook);

      const result = await bookUseCase.updateBook(bookId, updateData);

      expect(mockBookRepository.update).toHaveBeenCalledWith(bookId, updateData);
      expect(result).toEqual(updatedBook);
    });

    it("should update stock to zero", async () => {
      const bookId = "1";
      const updateData: Partial<Omit<Book, "id">> = {
        stock: 0,
      };

      const updatedBook: Book = {
        id: bookId,
        titulo: "Cien años de soledad",
        autorId: "author1",
        precio: 25.99,
        stock: 0,
      };

      mockBookRepository.update.mockResolvedValue(updatedBook);

    const result = await bookUseCase.updateBook(bookId, updateData);

      expect(result.stock).toBe(0);
      expect(result).toEqual(updatedBook);
    });
  });

  describe("deleteBook", () => {
    it("should delete book successfully", async () => {
      const bookId = "1";
      mockBookRepository.delete.mockResolvedValue();

      const result = await bookUseCase.deleteBook(bookId);

      expect(mockBookRepository.delete).toHaveBeenCalledWith(bookId);
      expect(result).toBeUndefined();
    });

    it("should handle repository deletion errors", async () => {
      const bookId = "1";
      mockBookRepository.delete.mockRejectedValue(new Error("Book not found"));

      await expect(bookUseCase.deleteBook(bookId)).rejects.toThrow("Book not found");
    });

    it("should handle non-existent book deletion", async () => {
      const bookId = "999";
      mockBookRepository.delete.mockRejectedValue(new Error("Book not found"));

      await expect(bookUseCase.deleteBook(bookId)).rejects.toThrow("Book not found");
    });
  });
});