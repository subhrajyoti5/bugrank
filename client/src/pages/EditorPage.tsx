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
              className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs font-medium">Back</span>
            </button>
            <div className="h-5 w-px bg-slate-700" />
            <h1 className="text-sm font-semibold text-slate-100">{challenge.title}</h1>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeTaken}s</span>
            </div>
            <span>Attempts: {attempts}</span>
            <span>Changed: {linesChanged}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Problem Description */}
          <div className="space-y-4 animate-slide-up">
            <div className="card bg-slate-900 border border-slate-800">
              <h2 className="text-xs font-semibold text-slate-200 mb-3 uppercase tracking-wide">Problem</h2>
              <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{challenge.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-800">
                <div className="text-xs text-slate-400 space-y-1">
                  <p><span className="font-medium text-slate-300">Language:</span> {challenge.language.toUpperCase()}</p>
                  <p><span className="font-medium text-slate-300">Points:</span> {challenge.baseScore}</p>
                  <p><span className="font-medium text-slate-300">Time Limit:</span> {challenge.timeLimit}s</p>
                </div>
              </div>
            </div>

            <div className="card bg-slate-900/60 border border-slate-800">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400 space-y-1">
                  <p className="font-medium text-slate-300">How it works:</p>
                  <ul className="space-y-0.5 text-slate-400">
                    <li>• <span className="font-medium text-slate-300">Run:</span> Test code with AI feedback (no penalties)</li>
                    <li>• <span className="font-medium text-slate-300">Submit:</span> Evaluation - scores if correct</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Results */}
            {(runResult || submitResult) && (
              <div className="card bg-slate-900 border border-slate-800 animate-fade-in">
                <h3 className="text-xs font-semibold text-slate-200 mb-3 uppercase tracking-wide">
                  {runResult ? 'Run Result' : 'Submission Result'}
                </h3>

                {submitResult && (
                  <div className={`mb-3 p-3 rounded text-xs ${
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
          <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="card p-0 overflow-hidden border border-slate-800">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800">
                <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wide">Editor</h2>
              </div>
              <div className="h-[600px]">
                <Editor
                  height="100%"
                  language={challenge.language === 'cpp' ? 'cpp' : 'java'}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleRun}
                disabled={running || submitting}
                className="px-3 py-1.5 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition disabled:opacity-50 flex-1 flex items-center justify-center space-x-1.5"
              >
                {running ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-400"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Run</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSubmit}
                disabled={running || submitting}
                className="px-3 py-1.5 text-xs font-medium rounded bg-orange-500 hover:bg-orange-600 text-white transition disabled:opacity-50 flex-1 flex items-center justify-center space-x-1.5"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit</span>
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
