import AppError from '../errors/AppError';
import dotenv from 'dotenv';
import { EnvDto, envSchema } from '../dtos/EnvDto';
dotenv.config();

let env: EnvDto;

try {

  env = envSchema.parse({
    port: process.env.PORT,
    mongodburi: process.env.MONGODB_URI,
    jwtsecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN,
    serverUrl: process.env.SERVER_URL
  });

} catch (error: any) {
  throw new AppError(`Variables de entorno inválidas${error.message}`, 500);
}

export default env;
