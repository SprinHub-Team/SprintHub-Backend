import app from './app';
import env from './config/env';
import {connectDatabase} from './config/database';

async function startserver(): Promise<void>{
    await connectDatabase();

    app.listen(env.port, ()=>{
        console.log(`Servidor escuchando en el puerto ${env.port}`);
        console.log(`Ver estado del servidor: http://localhost:${env.port}/api/health`);
    });
} 

startserver();