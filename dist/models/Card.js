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
exports.CardModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Comment_1 = require("./Comment");
const CardSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    columnId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Board', required: true }, // se coloco que este en false porque cuando se haga la validacion de la columna en el product backlog mongodb lanzaria un error de validacion y no se podria crear la tarjeta, ya que en el product backlog no hay columnas pero si se puede crear una tarjeta sin columna en pocas palabras no se debe de poner el true porque lanzaria error de validacion 
    position: { type: Number, required: true, default: 0 },
    assignedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date },
    priority: { type: String, enum: ['alta', 'media', 'baja'], default: 'media' },
    tasks: [{ title: { type: String, required: true }, completed: { type: Boolean, default: false } }]
}, { timestamps: true,
    versionKey: false
});
CardSchema.pre('findOneAndDelete', async function () {
    const cardId = this.getQuery()._id;
    await Comment_1.CommentModel.deleteMany({ cardId });
});
exports.CardModel = mongoose_1.default.model('Card', CardSchema);
