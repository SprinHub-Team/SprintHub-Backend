"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSprintInputSchema = exports.updateSprintInputSchema = exports.createSprintInputSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.createSprintInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'El nombre es obligatorio'),
    goal: zod_1.z.string().optional(),
    startDate: zod_1.z.string().datetime(),
    endDate: zod_1.z.string().datetime(),
    status: zod_1.z.enum(['planificado', 'activo', 'completado']).default('planificado'),
    groupId: idValidator_1.mongoIdSchema,
});
exports.updateSprintInputSchema = exports.createSprintInputSchema.partial().extend({
    sprintId: idValidator_1.mongoIdSchema,
});
exports.deleteSprintInputSchema = zod_1.z.object({
    sprintId: idValidator_1.mongoIdSchema,
});
