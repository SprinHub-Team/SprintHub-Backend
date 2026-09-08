// Usa llaves y el nombre exacto que tienes en tu archivo User.ts
import { UserModel } from '../models/User';

export class UserRepository {
  async create(data: any) {
    const newUser = new UserModel(data); // Cambia User por UserModel
    return await newUser.save();
  }

  async findByEmail(email: string) {
    return await UserModel.findOne({ email }); // Cambia User por UserModel
  }

  async findAll() {
    return await UserModel.find().select('-password');
  }

  async findById(id: string) {
    return await UserModel.findById(id).select('-password');
  }

  async update(id: string, data: any) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  async delete(id: string) {
    return await UserModel.findByIdAndDelete(id);
  }

  async existById(id: string) {
    const user = await UserModel.exists({ _id: id });
    return user !== null;
  }
}