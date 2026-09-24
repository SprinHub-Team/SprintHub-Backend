"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// Usa llaves y el nombre exacto que tienes en tu archivo User.ts
const User_1 = require("../models/User");
class UserRepository {
    async create(data) {
        const newUser = new User_1.UserModel(data);
        return await newUser.save();
    }
    async findByEmail(email) {
        return await User_1.UserModel.findOne({ email }).lean().exec();
    }
    async findAll() {
        return await User_1.UserModel.find().select('-password').lean().exec();
    }
    async findById(id) {
        return await User_1.UserModel.findById(id).select('-password').lean().exec();
    }
    async update(id, data) {
        return await User_1.UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password -passwordHash');
    }
    async delete(id) {
        return await User_1.UserModel.findByIdAndDelete(id);
    }
    async existById(id) {
        const user = await User_1.UserModel.exists({ _id: id });
        return user !== null;
    }
}
exports.UserRepository = UserRepository;
