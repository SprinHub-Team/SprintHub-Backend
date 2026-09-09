import {Socket} from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env';

export interface AuthSocket extends Socket{
    data:{
        userId: string;
        role: string;
    }
}

export function socketAuthMiddleware(socket: Socket, next:(err?: Error) => void){

	const token = socket.handshake.auth?.token as string | undefined;
	if(!token){

		return next(new Error('No se proporciono token de autentificacion'));
	
	}

	try{

		const decoded = jwt.verify(token, env.jwtsecret || 'secret') as {userId: string; role: string}
		socket.data.userId = decoded.userId;
		socket.data.role = decoded.role;
		next();
	}catch(err){
		next(new Error('Token inavlido para sesion de Sockets'));
	}

}
