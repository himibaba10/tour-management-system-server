import z from "zod";

const setPasswordZodSchema = z.object({
  password: z
    .string({ invalid_type_error: "Password must be string" })
    .min(1, { message: "Password is required" }),
});

const resetPasswordZodSchema = z.object({
  oldPassword: z
    .string({ invalid_type_error: "Password must be string" })
    .min(1, { message: "Old password is required" }),
  newPassword: z
    .string({ invalid_type_error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
});

const changePasswordZodSchema = z.object({
  oldPassword: z
    .string({ invalid_type_error: "Password must be string" })
    .min(1, { message: "Old password is required" }),
  newPassword: z
    .string({ invalid_type_error: "Password must be string" })
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),
});

const authValidations = {
  setPasswordZodSchema,
  resetPasswordZodSchema,
  changePasswordZodSchema,
};

export default authValidations;
