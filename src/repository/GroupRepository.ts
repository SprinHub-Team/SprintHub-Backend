import { GroupModel, IGroup } from '../models/Group';

export class GroupRepository {
  async findById(id: string): Promise<IGroup | null> {
    return GroupModel.findById(id)
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email')
      .lean()
      .exec();
  }

  async findByUserId(userId: string): Promise<IGroup[]> {
    return GroupModel.find({ 'members.user': userId })
      .populate('ownerId', 'name email')
      .populate('members.user', 'name email')
      .lean()
      .exec();
  }

  async create(data: Pick<IGroup, 'name' | 'description'> & {ownerId: string}): Promise<IGroup> {
    const group = await GroupModel.create({ ...data, members: [] });
    return group.toObject();
  }

  async update(id: string, data: Partial<Pick<IGroup, 'name' | 'description'>>): Promise<IGroup | null> {
    return GroupModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean().exec();
  }

  async addMember(groupId: string, userId: string, role: 'admin' | 'collaborator' | 'visitor'): Promise<IGroup | null> {
    return GroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: { user: userId, role } } },
      { returnDocument: 'after', runValidators: true }
    ).lean().exec();
  }

  async removeMember(groupId: string, userId: string): Promise<IGroup | null> {
    return GroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { members: { user: userId } } },
      { returnDocument: 'after' }
    ).lean().exec();
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const exists = await GroupModel.exists({ _id: groupId, 'members.user': userId });
    return exists !== null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await GroupModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async existById(id: string): Promise<boolean> {
    return (await GroupModel.exists({ _id: id })) !== null;
  }
}