import { UserModel, IUser } from '../models/User';

export class UserRepository {
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).lean().exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findByDocumentId(documentId: string): Promise<IUser | null> {
    return UserModel.findOne({ documentId }).lean().exec();
  }

  async create(data: Pick<IUser, 'name' | 'email' | 'documentId' | 'passwordHash'> & { role?: 'admin' | 'user' }): Promise<IUser> {
    const user = await UserModel.create(data);
    return user.toObject();
  }

  async update(id: string, data: Partial<Pick<IUser, 'name' | 'email' | 'role'>>): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean().exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async existById(id: string): Promise<boolean> {
    return (await UserModel.exists({ _id: id })) !== null;
  }

  async existManyByIds(ids: string[]): Promise<boolean> {
    const count = await UserModel.countDocuments({ _id: { $in: ids } }).exec();
    return count === ids.length;
  }
}