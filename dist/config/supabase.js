"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = __importDefault(require("./env"));
const supabase = (0, supabase_js_1.createClient)(env_1.default.supabaseUrl, env_1.default.supabaseKey);
exports.default = supabase;
