"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SCORING_CONFIG = exports.SubmissionType = void 0;
// Run vs Submit types
var SubmissionType;
(function (SubmissionType) {
    SubmissionType["RUN"] = "RUN";
    SubmissionType["SUBMIT"] = "SUBMIT"; // Full evaluation with scoring
})(SubmissionType || (exports.SubmissionType = SubmissionType = {}));
exports.DEFAULT_SCORING_CONFIG = {
    baseScore: 100,
    attemptPenalty: 5,
    linePenalty: 1,
    timePenalty: 0.1,
    successThreshold: 8
};
