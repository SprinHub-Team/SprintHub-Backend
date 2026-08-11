import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config();

const doc = {
  info: {
    title: 'API Documentación MERN Stack',
    description: 'Documentación automática generada sin comentarios manuales'
  },
  host: `localhost:${process.env.PORT || 3000}`
};

const outputFile = './swagger-output.json';
const routes = ['./server.js']; 
swaggerAutogen()(outputFile, routes);
