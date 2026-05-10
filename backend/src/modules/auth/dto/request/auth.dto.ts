import { z } from "zod";
import { registerSchema, loginSchema } from "../../validation/auth.validation";

export type RegisterRequest = z.infer<typeof registerSchema>["body"];
export type LoginRequest = z.infer<typeof loginSchema>["body"];
