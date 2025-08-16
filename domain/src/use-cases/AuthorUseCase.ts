import { Author } from "../entities/Author";
import { AuthorRepository } from "../repositories/AuthorRepository";

export class AuthorUseCase {
  constructor(private authorRepository: AuthorRepository) {}

  async getAllAuthors() {
    return this.authorRepository.findAll();
  }

  async getAuthorById(id: string) {
    return this.authorRepository.findById(id);
  }

  async createAuthor(authorData: Omit<Author, "id">) {
    return this.authorRepository.create(authorData);
  }

  async updateAuthor(id: string, updateData: Partial<Omit<Author, "id">>) {
    return this.authorRepository.update(id, updateData);
  }

  async deleteAuthor(id: string) {
    return this.authorRepository.delete(id);
  }
}