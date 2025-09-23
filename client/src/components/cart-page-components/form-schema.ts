import { z } from "zod";

export const cartFormSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "Имя обязательно" })
    .max(30, { message: "Имя не может превышать 30 символов" }),
  lastname: z
    .string()
    .min(1, { message: "Фамилия обязательна" })
    .max(30, { message: "Фамилия не может превышать 30 символов" }),
  email: z.string().email({ message: "Некорректный email" }),
  phone: z
    .string()
    .regex(
      /^[+0-9]*$/,
      "Номер телефона может содержать только цифры и знак '+'"
    )
    .min(1, { message: "Номер телефона обязателен" })
    .max(12),
  address: z.string().min(5, { message: "Введите корректный адрес" }),
  comment: z.string().optional(),
});

export type TypeCartFormSchema = z.infer<typeof cartFormSchema>;
