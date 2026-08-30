import { GroupModel, IGroup } from '../models/Group';
import mongoose from 'mongoose';

export class GroupRepository {
  async findById(id: mongoose.Types.ObjectId): Promise<IGroup | null> {
    return GroupModel.findById(id).populate('ownerId', 'name email').populate('members.user', 'name email').exec();
  }

  async findByUserId(userId: mongoose.Types.ObjectId): Promise<IGroup[]> {
    return GroupModel.find({ 'members.user': userId })
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email')
      .exec();
  }

  async create(data: Partial<IGroup>): Promise<IGroup> {
    const newGroup = new GroupModel(data);
    return newGroup.save();
  }

  async addMember(groupId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, role: string): Promise<IGroup | null> {
    return GroupModel.findByIdAndUpdate(
      groupId,
      { $push: { members: { user: userId, role } } },
      { new: true }
    ).exec();
  }

  async delete(id: mongoose.Types.ObjectId): Promise<boolean> {
    const result = await GroupModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async existById(id: string): Promise<boolean>{
    const result = await GroupModel.exists({_id: id}).exec();
    return result !== null;
  }

}
