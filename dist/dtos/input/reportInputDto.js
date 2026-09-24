"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompletedActivitiesSchema = exports.getUserPerformanceSchema = exports.getGroupPerformanceSchema = void 0;
const zod_1 = require("zod");
const idValidator_1 = require("../../utils/idValidator");
exports.getGroupPerformanceSchema = zod_1.z.object({
    groupId: idValidator_1.mongoIdSchema,
});
exports.getUserPerformanceSchema = zod_1.z.object({
    userId: idValidator_1.mongoIdSchema,
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
exports.getCompletedActivitiesSchema = zod_1.z.object({
    groupId: idValidator_1.mongoIdSchema,
});
