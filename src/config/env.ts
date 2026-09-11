import { z } from 'zod';
import AppError from '../errors/AppError';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  MONGODB_URI: z.string("MONGODB_URI es requerida"),
  JWT_SECRET: z.string("JWT_SECRET es requerido"),
  CORS_ORIGIN: z.string("CORS_ORIGIN es requerido")
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  throw new AppError("Variables de entorno no configuradas correctamente", 500);
}

const env = {
  port: result.data.PORT,
  mongodburi: result.data.MONGODB_URI,
  jwtsecret: result.data.JWT_SECRET,
  corsOrigin: result.data.CORS_ORIGIN
};

export default env;
