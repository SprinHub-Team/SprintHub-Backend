import swaggerAutogen from 'swagger-autogen';
import dotenv from 'dotenv';

dotenv.config();

const doc = {
  info: {
    title: 'API Documentación MERN Stack',
    description: 'Documentación automática generada sin comentarios manuales'
  },
  host: `https://sprinthub-back-bgfag6eyehh0hghh.centralus-01.azurewebsites.net'}`
};

const outputFile = './swagger-output.json';
const routes = ['./server.js']; 
swaggerAutogen()(outputFile, routes);
console.log('Documentación generada en Correctamente.');
