import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  GEMINI_API_KEY not set - AI analysis will return default responses');
}

const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

// Use Gemini 1.5 Flash (free tier)
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash' 
});

export default genAI;
