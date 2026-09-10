import dotenv from 'dotenv';
dotenv.config();

const env = {
    port: process.env.PORT || 3000,
    mongodburi: process.env.MONGODB_URI,
    jwtsecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN
};

export default env;