import { User } from "@prisma/client";
import { authRepository, AuthRepository } from "../repository/auth.repository";
import { hashPassword, comparePassword } from "@/utils/password";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/utils/jwt";
import { AuthenticationError, ConflictError, NotFoundError } from "@/common/errors";
import { RegisterRequest, LoginRequest } from "../dto/request/auth.dto";

export class AuthService {
  constructor(private readonly repository: AuthRepository = authRepository) {}

  async register(data: RegisterRequest) {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.repository.create({
      ...data,
      password: hashedPassword,
    });

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return {
      user: this.excludePassword(user),
      tokens: { accessToken, refreshToken },
    };
  }

  async login(data: LoginRequest) {
    const user = await this.repository.findByEmail(data.email);
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid email or password");
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return {
      user: this.excludePassword(user),
      tokens: { accessToken, refreshToken },
    };
  }

  async refresh(token: string) {
    try {
      const payload = verifyRefreshToken(token);
      const user = await this.repository.findById(payload.userId);
      
      if (!user) {
        throw new AuthenticationError("User not found");
      }

      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const newRefreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      return {
        tokens: { accessToken, refreshToken: newRefreshToken },
      };
    } catch (error) {
      throw new AuthenticationError("Invalid refresh token");
    }
  }

  private excludePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();
