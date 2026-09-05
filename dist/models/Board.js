"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Column_1 = require("../models/Column");
const BoardSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    groupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Group', required: true },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true,
    versionKey: false
});
BoardSchema.pre('findOneAndDelete', async function () {
    const boardId = this.getQuery()._id;
    const columns = await Column_1.ColumnModel.find({ boardId }).select('_id');
    for (const column of columns) {
        await Column_1.ColumnModel.findByIdAndDelete(column._id);
    }
});
exports.BoardModel = mongoose_1.default.model('Board', BoardSchema);
