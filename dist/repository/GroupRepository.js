"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
const Group_1 = require("../models/Group");
class GroupRepository {
    async findById(id) {
        return Group_1.GroupModel.findById(id)
            .populate('ownerId', 'name email')
            .populate('members.user', 'name email')
            .lean()
            .exec();
    }
    async findByUserId(userId) {
        return Group_1.GroupModel.find({ 'members.user': userId })
            .populate('ownerId', 'name email')
            .populate('members.user', 'name email')
            .lean()
            .exec();
    }
    async create(data) {
        const group = await Group_1.GroupModel.create({ ...data, members: [] });
        return group.toObject();
    }
    async update(id, data) {
        return Group_1.GroupModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean().exec();
    }
    async addMember(groupId, userId, role) {
        return Group_1.GroupModel.findByIdAndUpdate(groupId, { $addToSet: { members: { user: userId, role } } }, { new: true, runValidators: true }).lean().exec();
    }
    async removeMember(groupId, userId) {
        return Group_1.GroupModel.findByIdAndUpdate(groupId, { $pull: { members: { user: userId } } }, { new: true }).lean().exec();
    }
    async isMember(groupId, userId) {
        const exists = await Group_1.GroupModel.exists({ _id: groupId, 'members.user': userId });
        return exists !== null;
    }
    async delete(id) {
        const result = await Group_1.GroupModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async existById(id) {
        return (await Group_1.GroupModel.exists({ _id: id })) !== null;
    }
}
exports.GroupRepository = GroupRepository;
