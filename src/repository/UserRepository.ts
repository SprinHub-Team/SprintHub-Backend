import { UserModel, IUser } from '../models/User';
import { CreateUserDto, UpdateUserDto } from '../dtos/UserDto';

export const UserRepository = {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  },

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  },

  async findByDocumentId(documentId: string): Promise<IUser | null> {
    return UserModel.findOne({ documentId });
  },

  async create(data: Omit<CreateUserDto, 'password'> & { passwordHash: string; role?: 'admin' | 'user' }): Promise<IUser> {
    const user = new UserModel({
      name: data.name,
      email: data.email,
      documentId: data.documentId,
      passwordHash: data.passwordHash,
      role: data.role || 'user'
    });
    return user.save();
  },

  async update(id: string, data: UpdateUserDto): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id);
  }
};
