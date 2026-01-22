import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { diffLines } from 'diff';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge, RunResult, SubmitResult } from '@bugrank/shared';
import { Play, Send, ArrowLeft, Clock, AlertCircle, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [attempts, setAttempts] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (id) {
      loadChallenge(id);
    }
  }, [id]);

  const loadChallenge = async (challengeId: string) => {
    try {
      const data = await challengeService.getById(challengeId);
      if (data) {
        setChallenge(data);
        setCode(data.buggyCode);
        setOriginalCode(data.buggyCode);
        startTimeRef.current = Date.now();
      } else {
        toast.error('Challenge not found');
        navigate('/problems');
      }
    } catch (error) {
      toast.error('Failed to load challenge');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLinesChanged = () => {
    const diff = diffLines(originalCode, code);
    return diff.filter(part => part.added || part.removed).length;
  };

  const handleRun = async () => {
    if (!challenge) return;

    setRunning(true);
    setRunResult(null);
    setSubmitResult(null);

    try {
      const result = await submissionService.run(challenge.id, code);
      setRunResult(result);
      toast.success('Code analyzed! Check feedback below.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to run code');
      console.error(error);
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;

    setSubmitting(true);
    setRunResult(null);
    setSubmitResult(null);

    try {
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const result = await submissionService.submit(challenge.id, code, timeTaken);
      
      setSubmitResult(result);
      setAttempts(result.submission.attempts);

      if (result.submission.isCorrect && result.score) {
        toast.success(`🎉 Correct! You earned ${result.score} points!`);
      } else {
        toast.error('Not quite right. Keep trying!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit code');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  const linesChanged = calculateLinesChanged();
  const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-full">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/problems')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Problems</span>
            </button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">{challenge.title}</h1>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{timeTaken}s elapsed</span>
            </div>
            <div className="text-gray-600">Attempts: {attempts}</div>
            <div className="text-gray-600">Lines changed: {linesChanged}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6 animate-slide-up">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{challenge.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p><strong>Language:</strong> {challenge.language.toUpperCase()}</p>
                  <p><strong>Base Score:</strong> {challenge.baseScore} points</p>
                  <p><strong>Time Limit:</strong> {challenge.timeLimit} seconds</p>
                </div>
              </div>
            </div>

            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-2">How it works:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• <strong>Run:</strong> Test your code and get AI feedback (no penalties)</li>
                    <li>• <strong>Submit:</strong> Official evaluation - scores only if correct</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Results */}
            {(runResult || submitResult) && (
              <div className="card animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {runResult ? 'Run Result' : 'Submission Result'}
                </h3>

                {submitResult && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    submitResult.submission.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {submitResult.submission.isCorrect ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-900">Correct Solution!</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <span className="font-semibold text-red-900">Not Quite Right</span>
                        </>
                      )}
                    </div>
                    {submitResult.score !== undefined && (
                      <p className="text-sm text-gray-700">Score: <strong>{submitResult.score} points</strong></p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">{submitResult.message}</p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">AI Accuracy Score:</span>
                    <span className="ml-2 text-gray-900">
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.accuracyScore}/10
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Time Complexity:</span>
                    <span className="ml-2 font-mono text-gray-900">
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.timeComplexity}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Space Complexity:</span>
                    <span className="ml-2 font-mono text-gray-900">
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.spaceComplexity}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700 block mb-2">Feedback:</span>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card p-0 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
              </div>
              <div className="h-[600px]">
                <Editor
                  height="100%"
                  language={challenge.language === 'cpp' ? 'cpp' : 'java'}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="btn btn-secondary flex-1 flex items-center justify-center space-x-2"
              >
                {running ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Run (Test)</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit (Score)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
