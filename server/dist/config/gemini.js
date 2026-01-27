"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not set - AI analysis will return default responses');
}
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || 'dummy-key');
// Use Gemini 1.5 Flash (free tier)
exports.geminiModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});
exports.default = genAI;
