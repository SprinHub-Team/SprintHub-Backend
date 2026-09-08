"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardPBRepository = void 0;
const CardPB_1 = require("../models/CardPB");
class CardPBRepository {
    async create(cardData) {
        const card = new CardPB_1.CardPBModel(cardData);
        return await card.save();
    }
    async findBacklogByGroup(groupId, search, assignedTo) {
        const filter = {
            groupId,
            sprintId: null
        };
        if (assignedTo) {
            filter.assignedTo = assignedTo;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        return await CardPB_1.CardPBModel.find(filter).populate('assignedTo', 'name email');
    }
    async delete(id) {
        return await CardPB_1.CardPBModel.findByIdAndDelete(id);
    }
    async updateSprint(cardId, sprintId) {
        return await CardPB_1.CardPBModel.findByIdAndUpdate(cardId, { sprintId: sprintId }, { new: true }).populate('assignedTo', 'name email');
    }
    async findBySprint(sprintId) {
        return await CardPB_1.CardPBModel.find({ sprintId }).populate('assignedTo', 'name email');
    }
    async findById(id) {
        return await CardPB_1.CardPBModel.findById(id).populate('assignedTo', 'name email');
    }
}
exports.CardPBRepository = CardPBRepository;
