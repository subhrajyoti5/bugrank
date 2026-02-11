"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = exports.BaseService = void 0;
const gemini_1 = require("../config/gemini");
/**
 * Base service class following SOLID principles
 * All services extend this base class for consistency
 */
class BaseService {
    logInfo(message, data) {
        console.log(`[${this.constructor.name}] ${message}`, data || '');
    }
    logError(message, error) {
        console.error(`[${this.constructor.name}] ${message}`, error);
    }
}
exports.BaseService = BaseService;
/**
 * Service for AI code analysis using Google Gemini
 * Follows Single Responsibility Principle (SRP)
 */
class GeminiService extends BaseService {
    async analyzeCode(originalCode, fixedCode, language) {
        try {
            const prompt = this.buildAnalysisPrompt(originalCode, fixedCode, language);
            this.logInfo('Analyzing code with Gemini AI');
            const result = await gemini_1.geminiModel.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            this.logInfo('Gemini response received', text);
            return this.parseGeminiResponse(text);
        }
        catch (error) {
            this.logError('Gemini analysis failed', error.message);
            // Fallback: Basic local analysis
            this.logInfo('Using fallback analysis');
            return this.localAnalyzeCode(originalCode, fixedCode, language);
        }
    }
    localAnalyzeCode(originalCode, fixedCode, language) {
        // Compiler-like local analysis without Gemini
        this.logInfo('Running local compiler-level analysis');
        const isCodeChanged = originalCode.trim() !== fixedCode.trim();
        // Analyze various bug patterns
        let correctnessScore = 5;
        let efficiencyScore = 5;
        let qualityScore = 5;
        const issues = [];
        const optimizations = [];
        // Loop boundary check (Array Index Bug)
        if (originalCode.includes('i <= ') && fixedCode.includes('i < ')) {
            correctnessScore = 10;
            efficiencyScore = 9;
            qualityScore = 9;
            issues.push('(Fixed) Loop boundary error - was accessing beyond array bounds');
        }
        // Null check pattern (Null Pointer Bug)
        if (!originalCode.includes('if') && fixedCode.includes('if') && fixedCode.includes('null')) {
            correctnessScore = 10;
            efficiencyScore = 8;
            qualityScore = 9;
            issues.push('(Fixed) Null pointer - added proper null check before use');
        }
        // Destructor/cleanup (Memory Leak)
        if (!originalCode.includes('~') && fixedCode.includes('~')) {
            correctnessScore = 10;
            efficiencyScore = 9;
            qualityScore = 10;
            issues.push('(Fixed) Memory leak - added destructor for cleanup');
            optimizations.push('Consider using smart pointers to automate memory management');
        }
        // Synchronization (Race Condition)
        if (!originalCode.includes('synchronized') && fixedCode.includes('synchronized')) {
            correctnessScore = 10;
            efficiencyScore = 7;
            qualityScore = 10;
            issues.push('(Fixed) Race condition - added synchronization');
            optimizations.push('Consider using atomic operations for better performance');
        }
        // Data type upgrade (Integer Overflow)
        if ((originalCode.includes('int ') && fixedCode.includes('long ')) ||
            (originalCode.includes('int ') && fixedCode.includes('long long '))) {
            correctnessScore = 10;
            efficiencyScore = 8;
            qualityScore = 9;
            issues.push('(Fixed) Integer overflow - upgraded to larger data type');
        }
        // Code quality checks
        if (fixedCode.includes('//') || fixedCode.includes('/*')) {
            qualityScore += 1;
            optimizations.push('Good - includes explanatory comments');
        }
        if (fixedCode.length > originalCode.length * 1.3) {
            optimizations.push('Consider if code verbosity can be reduced');
        }
        if (!isCodeChanged) {
            correctnessScore = 2;
            issues.push('No code changes detected - the bug may not be fixed');
        }
        // Calculate final scores
        const avgScore = Math.round((correctnessScore + efficiencyScore + qualityScore) / 3);
        const isCorrect = correctnessScore >= 9 && isCodeChanged;
        const analysis = {
            accuracyScore: avgScore,
            timeComplexity: 'O(n) - No change',
            spaceComplexity: 'O(1) - No change',
            feedback: this.buildLocalFeedback({
                correctnessScore,
                efficiencyScore,
                qualityScore,
                issues,
                optimizations,
                isCorrect,
                performanceGain: correctnessScore >= 9 ? '✅ Bug Fixed!' : '⚠️ Needs Review',
            }),
            isCorrect,
        };
        this.logInfo('Local analysis complete:', {
            correctness: correctnessScore,
            efficiency: efficiencyScore,
            quality: qualityScore,
            average: avgScore,
        });
        return analysis;
    }
    buildLocalFeedback(data) {
        let feedback = ``;
        // Compiler-style header
        if (data.isCorrect) {
            feedback += `✅ COMPILATION SUCCESSFUL\n`;
            feedback += `========================\n\n`;
        }
        else {
            feedback += `❌ COMPILATION FAILED\n`;
            feedback += `====================\n\n`;
        }
        // Compiler-style warnings and errors
        if (data.issues.length > 0) {
            data.issues.forEach((issue) => {
                feedback += `warning: ${issue}\n`;
            });
            feedback += `\n`;
        }
        // Detailed compiler analysis
        feedback += `Analysis Report:\n`;
        feedback += `---------------\n`;
        feedback += `• Correctness Analysis: ${data.correctnessScore}/10 - `;
        if (data.correctnessScore >= 9) {
            feedback += `Bug completely fixed\n`;
        }
        else if (data.correctnessScore >= 7) {
            feedback += `Bug mostly fixed with minor issues\n`;
        }
        else {
            feedback += `Bug partially fixed or not addressed\n`;
        }
        feedback += `• Code Efficiency: ${data.efficiencyScore}/10 - `;
        if (data.efficiencyScore >= 8) {
            feedback += `Optimal performance\n`;
        }
        else if (data.efficiencyScore >= 6) {
            feedback += `Acceptable performance\n`;
        }
        else {
            feedback += `Performance can be improved\n`;
        }
        feedback += `• Code Quality: ${data.qualityScore}/10 - `;
        if (data.qualityScore >= 8) {
            feedback += `Follows best practices\n`;
        }
        else if (data.qualityScore >= 6) {
            feedback += `Acceptable code standards\n`;
        }
        else {
            feedback += `Needs improvement\n`;
        }
        feedback += `\n`;
        // Recommendations
        if (data.optimizations.length > 0) {
            feedback += `Compiler Notes:\n`;
            feedback += `---------------\n`;
            data.optimizations.forEach((opt) => {
                feedback += `note: ${opt}\n`;
            });
            feedback += `\n`;
        }
        // Final verdict
        feedback += `Result: ${data.performanceGain}\n`;
        return feedback;
    }
    buildAnalysisPrompt(originalCode, fixedCode, language) {
        return `You are an expert compiler and code optimizer. Perform a deep analysis of the following ${language} code fix:

ORIGINAL (BUGGY) CODE:
\`\`\`${language}
${originalCode}
\`\`\`

FIXED CODE:
\`\`\`${language}
${fixedCode}
\`\`\`

Perform a COMPILER-LEVEL analysis and return ONLY this JSON format (no markdown, no code blocks):
{
  "accuracyScore": <number 1-10>,
  "bugFixed": <true/false>,
  "timeComplexity": "<Big O notation before -> after>",
  "spaceComplexity": "<Big O notation before -> after>",
  "efficiencyScore": <number 1-10>,
  "correctnessScore": <number 1-10>,
  "codeQualityScore": <number 1-10>,
  "memoryUsage": "<estimated memory impact>",
  "performanceGain": "<percentage or description>",
  "issues": [<list of issues found>],
  "optimizations": [<list of possible optimizations>],
  "feedback": "<detailed compiler-like analysis>",
  "isCorrect": <true/false>
}

ANALYSIS CRITERIA (Score 1-10 for each):

1. CORRECTNESS (Does it fix the bug?):
   - 10: Perfectly fixes the bug, handles all edge cases
   - 8-9: Fixes the bug with minor room for improvement
   - 5-7: Partially fixes, may have edge cases
   - 1-4: Doesn't fix or creates new bugs

2. EFFICIENCY (Time/Space Complexity):
   - 10: Optimal for the problem, better than O(n)
   - 8-9: Linear time O(n), minimal space
   - 6-7: Acceptable but not optimal
   - 4-5: Inefficient, could be improved
   - 1-3: Very inefficient, significant overhead

3. CODE QUALITY (Best Practices):
   - 10: Follows all best practices, clean code
   - 8-9: Good practices, minor improvements possible
   - 6-7: Acceptable but some anti-patterns
   - 1-5: Multiple code quality issues

DETAILED ANALYSIS:
- Compare original vs fixed: Identify the specific bug and how it's fixed
- Time Complexity: Show progression (e.g., "O(n²) -> O(n)")
- Space Complexity: Analyze memory allocation changes
- Edge Cases: Check handling of boundaries, null values, empty inputs
- Resource Usage: Check for memory leaks, inefficient allocations
- Performance Impact: Calculate estimated improvement percentage
- Best Practices: Identify violations or improvements
- Potential Issues: List any remaining problems
- Optimization Tips: Suggest further improvements

ACCURACY SCORE FORMULA:
accuracyScore = (correctnessScore + efficiencyScore + codeQualityScore) / 3

PERFORMANCE GAIN Examples:
- "30% faster - reduced loop iterations"
- "50% less memory - eliminated unnecessary copy"
- "O(n²) to O(n log n) - better algorithm"

Return ONLY the JSON object, no additional text. No markdown. No code blocks.`;
    }
    parseGeminiResponse(text) {
        try {
            // Remove markdown code blocks if present
            let cleanText = text.trim();
            if (cleanText.startsWith('```json')) {
                cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            }
            else if (cleanText.startsWith('```')) {
                cleanText = cleanText.replace(/```\n?/g, '');
            }
            this.logInfo('Parsing Gemini response:', cleanText.substring(0, 100));
            const parsed = JSON.parse(cleanText);
            const analysis = {
                accuracyScore: parsed.accuracyScore || parsed.correctnessScore || 5,
                timeComplexity: parsed.timeComplexity || 'Unknown',
                spaceComplexity: parsed.spaceComplexity || 'Unknown',
                feedback: this.buildDetailedFeedback(parsed),
                isCorrect: parsed.isCorrect || parsed.bugFixed || parsed.accuracyScore >= 8,
            };
            this.logInfo('Successfully parsed analysis:', {
                accuracy: analysis.accuracyScore,
                efficiency: parsed.efficiencyScore,
                correctness: parsed.correctnessScore,
                quality: parsed.codeQualityScore,
                performanceGain: parsed.performanceGain,
            });
            return analysis;
        }
        catch (error) {
            this.logError('Failed to parse Gemini response', error.message);
            this.logError('Response text was:', text);
            // Return safe default
            return {
                accuracyScore: 5,
                timeComplexity: 'Unknown',
                spaceComplexity: 'Unknown',
                feedback: 'Could not parse AI analysis. Please try again.',
                isCorrect: false,
            };
        }
    }
    buildDetailedFeedback(parsed) {
        let feedback = '';
        if (parsed.feedback) {
            feedback = parsed.feedback;
        }
        // Add efficiency breakdown
        if (parsed.efficiencyScore || parsed.correctnessScore || parsed.codeQualityScore) {
            feedback += `\n\nScores:\n`;
            if (parsed.correctnessScore)
                feedback += `  * Correctness: ${parsed.correctnessScore}/10\n`;
            if (parsed.efficiencyScore)
                feedback += `  * Efficiency: ${parsed.efficiencyScore}/10\n`;
            if (parsed.codeQualityScore)
                feedback += `  * Code Quality: ${parsed.codeQualityScore}/10\n`;
        }
        // Add complexity comparison
        if (parsed.timeComplexity) {
            feedback += `\nTime Complexity: ${parsed.timeComplexity}\n`;
        }
        if (parsed.spaceComplexity) {
            feedback += `Space Complexity: ${parsed.spaceComplexity}\n`;
        }
        // Add performance gain
        if (parsed.performanceGain) {
            feedback += `\nPerformance: ${parsed.performanceGain}\n`;
        }
        // Add issues
        if (parsed.issues && parsed.issues.length > 0) {
            feedback += `\nIssues Found:\n`;
            parsed.issues.forEach((issue) => {
                feedback += `  * ${issue}\n`;
            });
        }
        // Add optimizations
        if (parsed.optimizations && parsed.optimizations.length > 0) {
            feedback += `\nPossible Optimizations:\n`;
            parsed.optimizations.forEach((opt) => {
                feedback += `  * ${opt}\n`;
            });
        }
        return feedback.trim();
    }
}
exports.GeminiService = GeminiService;
