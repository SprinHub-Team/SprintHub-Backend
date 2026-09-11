// Usa llaves y el nombre exacto que tienes en tu archivo User.ts
import { UserModel } from '../models/User';

export class UserRepository {
  async create(data: any) {
    const newUser = new UserModel(data); 
    return await newUser.save();
  }

  async findByEmail(email: string) {
    return await UserModel.findOne({ email }).lean().exec();
  }

  async findAll() {
    return await UserModel.find().select('-password').lean().exec();
  }

  async findById(id: string) {
    return await UserModel.findById(id).select('-password').lean().exec();
  }

  async update(id: string, data: any) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password -passwordHash');
  }

  async delete(id: string) {
    return await UserModel.findByIdAndDelete(id);
  }

  async existById(id: string) {
    const user = await UserModel.exists({ _id: id });
    return user !== null;
  }
}