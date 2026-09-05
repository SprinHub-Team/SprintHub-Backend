"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../models/User");
class UserRepository {
    async findById(id) {
        return User_1.UserModel.findById(id).lean().exec();
    }
    async findByEmail(email) {
        return User_1.UserModel.findOne({ email }).exec();
    }
    async findByDocumentId(documentId) {
        return User_1.UserModel.findOne({ documentId }).lean().exec();
    }
    async create(data) {
        const user = await User_1.UserModel.create(data);
        return user.toObject();
    }
    async update(id, data) {
        return User_1.UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean().exec();
    }
    async delete(id) {
        const result = await User_1.UserModel.findByIdAndDelete(id).exec();
        return result !== null;
    }
    async existById(id) {
        return (await User_1.UserModel.exists({ _id: id })) !== null;
    }
    async existManyByIds(ids) {
        const count = await User_1.UserModel.countDocuments({ _id: { $in: ids } }).exec();
        return count === ids.length;
    }
}
exports.UserRepository = UserRepository;
