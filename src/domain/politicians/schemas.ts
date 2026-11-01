import { z } from "zod";

export const politicianInput = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  party: z.string().trim().min(2).max(80),
  office: z.string().trim().min(2).max(80),
  state: z.string().regex(/^[A-Z]{2}$/),
  biography: z.string().trim().min(10).max(5000),
});

export const politicianFilters = z.object({
  q: z.string().trim().max(120).optional(),
  party: z.string().trim().max(80).optional(),
  office: z.string().trim().max(80).optional(),
  state: z.string().regex(/^[A-Z]{2}$/).optional(),
  pagina: z.coerce.number().int().min(1).max(100).optional(),
});
export type PoliticianFilters = z.infer<typeof politicianFilters>;
