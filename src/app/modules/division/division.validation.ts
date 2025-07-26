import { z } from "zod";

const createDivisionSchema = z.object({
  name: z.string().min(1),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

const updateDivisionSchema = z.object({
  name: z.string().min(1).optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

const divisionValidations = {
  createDivisionSchema,
  updateDivisionSchema,
};

export default divisionValidations;
