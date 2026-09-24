"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCardPbInputSchema = exports.updateCardPbInputSchema = exports.createCardPbInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.createCardPbInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'El ttulo es obligatorio'),
    description: zod_1.z.string().optional(),
    groupId: idValidator_1.mongoIdSchema,
    sprintId: idValidator_1.mongoIdSchema.optional().nullable(),
    assignedTo: idValidator_1.mongoIdSchema.optional().nullable(),
    dueDate: zod_1.z.string().datetime().optional().nullable(),
    priority: zod_1.z.enum(['alta', 'media', 'baja']).default('media'),
});
exports.updateCardPbInputSchema = exports.createCardPbInputSchema.partial().extend({
    cardPbId: idValidator_1.mongoIdSchema,
});
exports.deleteCardPbInputSchema = zod_1.z.object({
    cardPbId: idValidator_1.mongoIdSchema,
});
