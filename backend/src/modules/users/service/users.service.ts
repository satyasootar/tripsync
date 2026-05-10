import { User, Prisma } from "@prisma/client";
import { usersRepository, UsersRepository } from "../repository/users.repository";
import { NotFoundError } from "@/common/errors";

export class UsersService {
  constructor(private readonly repository: UsersRepository = usersRepository) {}

  async getProfile(id: string) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return this.excludePassword(user);
  }

  async updateProfile(id: string, data: Prisma.UserUpdateInput) {
    const user = await this.repository.update(id, data);
    return this.excludePassword(user);
  }

  async searchUsers(query: string) {
    const users = await this.repository.search(query);
    return users.map(user => this.excludePassword(user));
  }

  private excludePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const usersService = new UsersService();
