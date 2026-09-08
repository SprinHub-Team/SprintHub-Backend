"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// Usa llaves y el nombre exacto que tienes en tu archivo User.ts
const User_1 = require("../models/User");
class UserRepository {
    async create(data) {
        const newUser = new User_1.UserModel(data); // Cambia User por UserModel
        return await newUser.save();
    }
    async findByEmail(email) {
        return await User_1.UserModel.findOne({ email }); // Cambia User por UserModel
    }
    async findAll() {
        return await User_1.UserModel.find().select('-password');
    }
    async findById(id) {
        return await User_1.UserModel.findById(id).select('-password');
    }
    async update(id, data) {
        return await User_1.UserModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
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
