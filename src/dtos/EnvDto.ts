import z from "zod";

export const envSchema = z.object({
  port: z.string().default('3000'),
  mongodburi: z.string().min(1, { error: "MONGODB_URI es requerida" }),
  jwtsecret: z.string().min(1, { error: "JWT_SECRET es requerido" }),
  corsOrigin: z.string().min(1, { error: "CORS_ORIGIN es requerido" }),
  serverUrl: z.string().min(1, { error: "SERVER_URL es requerida" })
});

export type EnvDto = z.infer<typeof envSchema>;
