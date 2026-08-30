// import { CreateUserDto, LoginDto, UpdateUserDto } from '../dtos/UserDto';
// import { UserRepository } from '../repository/UserRepository';
// import AppError from '../errors/AppError';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import env from '../config/env';
// import { IUser } from '../models/User';

// export class UserService {
//   constructor(private userRepository = UserRepository) {}

//   async registerUser(data: CreateUserDto): Promise<IUser> {
//     const existingEmail = await this.userRepository.findByEmail(data.email);
//     const existingDoc = await this.userRepository.findByDocumentId(data.documentId);
//     if (existingEmail || existingDoc) {
//       throw new AppError('El correo o documento ya están registrados', 400);
//     }

//     const salt = await bcrypt.genSalt(10);
//     const passwordHash = await bcrypt.hash(data.password, salt);

//     return this.userRepository.create({
//       name: data.name,
//       email: data.email,
//       documentId: data.documentId,
//       passwordHash
//     });
//   }

//   async loginUser(data: LoginDto): Promise<{ token: string, user: Partial<IUser> }> {
//     const user = await this.userRepository.findByEmail(data.email);
//     if (!user) {
//       throw new AppError('Credenciales incorrectas', 401);
//     }

//     const isMatch = await bcrypt.compare(data.password, user.passwordHash);
//     if (!isMatch) {
//       throw new AppError('Credenciales incorrectas', 401);
//     }

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       env.jwtsecret || 'secret',
//       { expiresIn: '8h' }
//     );

//     return {
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     };
//   }

//   async getUserById(id: string): Promise<IUser> {
//     const user = await this.userRepository.findById(id);
//     if (!user) {
//       throw new AppError('Usuario no encontrado', 404);
//     }
//     return user;
//   }
// }
