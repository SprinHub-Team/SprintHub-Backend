"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SprintRepository = void 0;
const Sprint_1 = require("../models/Sprint");
class SprintRepository {
    async create(data) {
        const sprint = new Sprint_1.SprintModel(data);
        return await sprint.save();
    }
    async findByGroup(groupId) {
        return await Sprint_1.SprintModel.find({ groupId }).sort({ createdAt: -1 });
    }
    async findById(id) {
        return await Sprint_1.SprintModel.findById(id);
    }
    async update(id, updateData) {
        return await Sprint_1.SprintModel.findByIdAndUpdate(id, updateData, { new: true });
    }
}
exports.SprintRepository = SprintRepository;
