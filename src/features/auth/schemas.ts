import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Required"),
    rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    email: z.string().email(),
    password: z.string().min(8, "Password must contain minimum of 8 characters"),
});

export const updateProfileSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    avatar: z.string().url().optional(),
    avatarPublicId: z.string().optional(),
});

