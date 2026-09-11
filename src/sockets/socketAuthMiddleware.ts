import {Socket} from 'socket.io';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { JwtPayload } from '../dtos/JwtPayload';

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

		const decoded = jwt.verify(token, env.jwtsecret) as JwtPayload
		socket.data.userId = decoded.userId;
		socket.data.role = decoded.role;
		next();
	}catch(err){
		next(new Error('Token inavlido para sesion de Sockets'));
	}

}
