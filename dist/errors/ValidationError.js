"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.stack = '';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.default = ValidationError;
