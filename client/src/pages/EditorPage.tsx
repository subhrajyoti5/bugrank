import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { diffLines } from 'diff';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge, RunResult, SubmitResult } from '@bugrank/shared';
import { Play, Send, ArrowLeft, Clock, AlertCircle, CheckCircle, Info, FileText, BookOpen, Users, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'description' | 'editorial' | 'solutions' | 'submissions';
type PanelType = 'testcase' | 'result';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
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
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [activePanel, setActivePanel] = useState<PanelType>('testcase');

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
      setActivePanel('result'); // Switch to result tab

      if (result.submission.isCorrect && result.score) {
        // Refresh user data to update score in navbar
        await refreshUser();
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10';
      case 'hard':
        return 'text-rose-500 bg-rose-500/10';
      default:
        return 'text-slate-500 bg-slate-500/10';
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

  const tabs = [
    { id: 'description' as TabType, label: 'Description', icon: FileText },
    { id: 'editorial' as TabType, label: 'Editorial', icon: BookOpen },
    { id: 'solutions' as TabType, label: 'Solutions', icon: Users },
    { id: 'submissions' as TabType, label: 'Submissions', icon: List },
  ];

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 bg-white dark:bg-slate-900">
        <button
          onClick={() => navigate('/problems')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Problems</span>
        </button>
        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mr-4" />
        <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mr-3">{challenge.title}</h1>
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-slate-900 dark:text-white border-primary-500'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{challenge.title}</h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {challenge.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Language:</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100 font-semibold">
                      {challenge.language.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Points:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{challenge.baseScore}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Time Limit:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{challenge.timeLimit}s</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Time Elapsed:</span>
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{timeTaken}s</span>
                  </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-700 dark:text-slate-300">
                      <p className="font-semibold mb-2">How it works:</p>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                        <li>• <strong>Run:</strong> Test code with AI feedback (no penalties)</li>
                        <li>• <strong>Submit:</strong> Final evaluation - scores if correct</li>
                        <li>• Multiple attempts reduce points by 8% each time</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'editorial' && (
              <div className="text-slate-600 dark:text-slate-400 text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Editorial coming soon...</p>
              </div>
            )}

            {activeTab === 'solutions' && (
              <div className="text-slate-600 dark:text-slate-400 text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Community solutions coming soon...</p>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="text-slate-600 dark:text-slate-400 text-center py-12">
                <List className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Submission history: {attempts} attempt{attempts !== 1 ? 's' : ''}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={challenge.language === 'cpp' ? 'cpp' : 'java'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>

          {/* Bottom Panel - Test Case / Results */}
          <div className="h-64 border-t border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
            {/* Panel Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActivePanel('testcase')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activePanel === 'testcase'
                    ? 'text-slate-900 dark:text-white border-primary-500'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Testcase
              </button>
              <button
                onClick={() => setActivePanel('result')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activePanel === 'result'
                    ? 'text-slate-900 dark:text-white border-primary-500'
                    : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Test Result
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activePanel === 'testcase' && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Expected Output:</p>
                    <pre className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-3 text-xs font-mono text-slate-900 dark:text-slate-300">
                      {challenge.expectedOutput}
                    </pre>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Click <strong>Run</strong> to test your code or <strong>Submit</strong> for evaluation
                  </p>
                </div>
              )}

              {activePanel === 'result' && (
                <div className="space-y-4">
                  {(runResult || submitResult) ? (
                    <>
                      {/* Test Case Output */}
                      {(runResult?.testCaseOutput || submitResult?.testCaseOutput) && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Test Case Validation</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              (runResult?.testCasePassed || submitResult?.testCasePassed)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {(runResult?.testCasePassed || submitResult?.testCasePassed) ? '✅ PASS' : '❌ FAIL'}
                            </span>
                          </div>
                          <pre className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-3 text-xs font-mono text-slate-900 dark:text-slate-300 max-h-32 overflow-auto">
                            {runResult?.testCaseOutput || submitResult?.testCaseOutput}
                          </pre>
                        </div>
                      )}

                      {/* Compiler Output */}
                      {(runResult?.compilerOutput || submitResult?.compilerOutput) && (
                        <div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Compiler Output</p>
                          <pre className="bg-slate-100 dark:bg-slate-950 border border-red-200 dark:border-red-900/50 rounded p-3 text-xs font-mono text-red-700 dark:text-red-400 max-h-32 overflow-auto">
                            {runResult?.compilerOutput || submitResult?.compilerOutput}
                          </pre>
                        </div>
                      )}

                      {/* AI Analysis */}
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis) && (
                        <div className="space-y-2 text-sm">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">AI Analysis</p>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Accuracy:</span>
                              <span className="ml-2 font-semibold text-slate-900 dark:text-slate-100">
                                {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.accuracyScore}/10
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600 dark:text-slate-400">Time:</span>
                              <span className="ml-2 font-mono text-slate-900 dark:text-slate-100">
                                {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.timeComplexity}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-slate-600 dark:text-slate-400 text-xs">
                              {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.feedback}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Submit Status */}
                      {submitResult && (
                        <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                          submitResult.submission.isCorrect
                            ? 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {submitResult.submission.isCorrect ? (
                            <><CheckCircle className="h-5 w-5" /> Accepted - {submitResult.score} points earned!</>
                          ) : (
                            <><AlertCircle className="h-5 w-5" /> Wrong Answer</>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-500 text-sm text-center py-8">
                      You must run your code first
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                <span>Attempts: {attempts}</span>
                <span>Changed: {linesChanged} lines</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={running || submitting}
                  className="px-6 py-2 text-sm font-medium rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition disabled:opacity-50 flex items-center gap-2"
                >
                  {running ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run
                    </>
                  )}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={running || submitting}
                  className="px-6 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
