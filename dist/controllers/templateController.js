"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateController = exports.TemplateController = void 0;
const templates_1 = require("../utils/templates");
class TemplateController {
    async getAll(req, res) {
        try {
            res.status(200).json(templates_1.BOARD_TEMPLATES);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching templates' });
        }
    }
}
exports.TemplateController = TemplateController;
exports.templateController = new TemplateController();
