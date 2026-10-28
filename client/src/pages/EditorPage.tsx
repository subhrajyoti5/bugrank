import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { diffLines } from 'diff';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge, RunResult, SubmitResult } from '@bugpulse/shared';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

type TabType = 'description' | 'editorial' | 'solutions' | 'submissions';
type PanelType = 'testcase' | 'result';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { isDark } = useTheme();

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

  // Resizable Panel States
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [panelHeight, setPanelHeight] = useState(300);
  const isResizingSidebar = useRef(false);
  const isResizingPanel = useRef(false);

  useEffect(() => {
    if (id) {
      loadChallenge(id);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingSidebar.current) {
        const newWidth = Math.max(300, Math.min(650, e.clientX));
        setSidebarWidth(newWidth);
      }
      if (isResizingPanel.current) {
        const newHeight = Math.max(160, Math.min(window.innerHeight - 200, window.innerHeight - e.clientY - 16));
        setPanelHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      isResizingSidebar.current = false;
      isResizingPanel.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id]);

  const startResizingSidebar = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingSidebar.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const startResizingPanel = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingPanel.current = true;
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

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
    setActivePanel('result');

    try {
      const result = await submissionService.run(challenge.id, code);
      setRunResult(result);
      toast.success('Diagnostics completed');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Execution failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!challenge) return;

    setSubmitting(true);
    setRunResult(null);
    setSubmitResult(null);
    setActivePanel('result');

    try {
      const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const result = await submissionService.submit(challenge.id, code, timeTaken);
      
      setSubmitResult(result);
      setAttempts(result.submission.attemptNumber);

      if (result.submission.isCorrect && result.score) {
        await refreshUser();
        toast.success(`Correct surgical fix: +${result.score} XP`);
      } else {
        toast.error('Verification failed. Diagnostic invariants not satisfied.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'medium':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
      case 'hard':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-surface-subtle text-text-muted border-border-line';
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-canvas flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-md border-2 border-border-line border-t-text-primary animate-spin mb-4" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Initializing Sandbox Environment...
        </span>
      </div>
    );
  }

  if (!challenge) return null;

  const linesChanged = calculateLinesChanged();
  const timeTakenSec = Math.floor((Date.now() - startTimeRef.current) / 1000);

  const tabs = [
    { id: 'description' as TabType, label: 'Briefing' },
    { id: 'editorial' as TabType, label: 'Analysis' },
    { id: 'solutions' as TabType, label: 'Submissions' },
    { id: 'submissions' as TabType, label: 'Logs' },
  ];

  return (
    <div className="h-screen flex flex-col bg-canvas text-text-primary overflow-hidden font-sans select-none transition-colors duration-200">
      
      {/* ─────────────────────────────────────────────────────────────
          TOP WORKSPACE HEADER
          ───────────────────────────────────────────────────────────── */}
      <div className="h-14 border-b border-border-line flex items-center justify-between px-6 bg-surface-card shrink-0 relative z-20">
        
        {/* Left: Exit & Title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate('/problems')}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-xs font-mono font-medium cursor-pointer"
          >
            <div className="px-2 py-1 rounded-md border border-border-line bg-surface-subtle hover:border-text-primary transition-colors">
              &lt;-
            </div>
            <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Missions</span>
          </button>
          
          <div className="h-4 w-px bg-border-line" />
          
          <div className="flex items-center gap-2.5 truncate">
            <h1 className="text-sm font-medium text-text-primary truncate">
              {challenge.title}
            </h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border shrink-0 ${getDifficultyBadge(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* Right: Timer & Theme Toggle */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-surface-subtle rounded-md border border-border-line text-xs font-mono font-medium text-text-secondary">
            <span>
              {Math.floor(timeTakenSec / 60).toString().padStart(2, '0')}:{(timeTakenSec % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <ThemeToggle />
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MAIN SPLIT WORKSPACE
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Sidebar Tabs Area */}
        <div 
          className="border-r border-border-line flex flex-col bg-surface-card shrink-0 relative"
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Tab selector - Rectangular */}
          <div className="flex p-1.5 bg-surface-subtle border-b border-border-line gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-surface-card text-text-primary font-semibold shadow-sm border border-border-line'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 select-text">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md border border-border-line bg-surface-subtle mb-3">
                    <span className="eyebrow-text text-[9px]">INCIDENT BRIEF</span>
                  </div>
                  <h2 className="font-serif text-2xl text-text-primary mb-3">
                    {challenge.title}
                  </h2>
                  <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap font-normal">
                    {challenge.description}
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-surface-subtle border border-border-line">
                    <span className="eyebrow-text text-[9px] block mb-1">XP Value</span>
                    <span className="font-serif text-2xl text-text-primary">
                      {challenge.baseScore}
                    </span>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-subtle border border-border-line">
                    <span className="eyebrow-text text-[9px] block mb-1">Dialect</span>
                    <span className="font-mono text-sm font-semibold uppercase text-text-primary">
                      {challenge.language === 'cpp' ? 'C++20' : challenge.language}
                    </span>
                  </div>
                </div>

                {/* Directives */}
                <div className="p-4 rounded-lg border border-border-line bg-surface-subtle/50 space-y-2.5">
                  <span className="eyebrow-text text-[10px] block">DIRECTIVES</span>
                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    <li className="flex items-start gap-2">
                      <span className="text-text-muted font-mono">-</span>
                      <span>Isolate the root invalid memory or race invariant.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-text-muted font-mono">-</span>
                      <span>Modify the minimal contiguous lines necessary.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-text-muted font-mono">-</span>
                      <span>Verify through diagnostics before submitting final fix.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab !== 'description' && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                <span className="font-mono text-xs text-text-muted uppercase tracking-wider block">
                  SECTION UNDER REVIEW
                </span>
                <p className="text-xs text-text-secondary max-w-xs">
                  Additional peer solutions and telemetry archives are accessible after completing your first verified fix.
                </p>
              </div>
            )}
          </div>

          {/* Vertical Resizer Handle */}
          <div 
            onMouseDown={startResizingSidebar}
            className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-text-primary/30 transition-colors z-30"
          />
        </div>

        {/* Right: Editor & Diagnostics Panel */}
        <div className="flex-1 flex flex-col bg-canvas overflow-hidden">
          
          {/* Monaco Editor Canvas */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={challenge.language === 'cpp' ? 'cpp' : 'java'}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme={isDark ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 13.5,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20, bottom: 20 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                renderLineHighlight: 'all',
                tabSize: 4,
              }}
            />
          </div>

          {/* Horizontal Resizer Handle */}
          <div 
            onMouseDown={startResizingPanel}
            className="h-1.5 w-full cursor-row-resize hover:bg-text-primary/30 transition-colors z-30 shrink-0 bg-border-line"
          />

          {/* Bottom Diagnostics Drawer */}
          <div 
            className="flex flex-col bg-surface-card border-t border-border-line shrink-0"
            style={{ height: `${panelHeight}px` }}
          >
            {/* Panel Selector Header */}
            <div className="flex items-center justify-between px-4 border-b border-border-line bg-surface-subtle">
              <div className="flex gap-1">
                {[
                  { id: 'testcase' as PanelType, label: 'Expected Output' },
                  { id: 'result' as PanelType, label: 'Diagnostic Output' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePanel(p.id)}
                    className={`px-3 py-2 text-xs font-medium transition-all border-b-2 cursor-pointer ${
                      activePanel === p.id 
                        ? 'text-text-primary border-text-primary font-semibold' 
                        : 'text-text-muted border-transparent hover:text-text-primary'
                    }`}
                  >
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
                <span>Diff: <strong className="text-text-primary">{linesChanged} lines</strong></span>
                <span>Attempts: <strong className="text-text-primary">{attempts}</strong></span>
              </div>
            </div>

            {/* Panel Body Content */}
            <div className="flex-1 overflow-y-auto p-4 select-text">
              {activePanel === 'testcase' && (
                <div className="space-y-3 max-w-2xl">
                  <div>
                    <span className="eyebrow-text text-[10px] block mb-1.5">TARGET OUTPUT STREAM</span>
                    <pre className="bg-surface-subtle border border-border-line rounded-lg p-3.5 text-xs font-mono text-text-primary overflow-x-auto leading-relaxed">
                      {challenge.expectedOutput}
                    </pre>
                  </div>
                </div>
              )}

              {activePanel === 'result' && (
                <div className="space-y-4">
                  {!(runResult || submitResult) && !running && !submitting ? (
                    <div className="h-full flex flex-col items-center justify-center py-6 text-text-muted font-mono text-xs">
                      <span>Ready for diagnostic execution</span>
                    </div>
                  ) : (
                    <div>
                      {/* Loading spinner */}
                      {(running || submitting) && (
                        <div className="flex items-center gap-2.5 text-text-secondary py-3">
                          <div className="w-3.5 h-3.5 rounded-sm border-2 border-border-line border-t-text-primary animate-spin" />
                          <span className="text-xs font-mono uppercase tracking-wider">
                            Executing sandbox diagnostics...
                          </span>
                        </div>
                      )}

                      {/* Analysis Card */}
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis) && (
                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                          <div className="p-3.5 rounded-lg border border-border-line bg-surface-subtle">
                            <span className="eyebrow-text text-[10px] block mb-1">ANALYSIS SUMMARY</span>
                            <p className="text-xs text-text-secondary leading-relaxed">
                              {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.feedback}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3.5 rounded-lg bg-surface-subtle border border-border-line text-center">
                              <span className="eyebrow-text text-[9px] block mb-1">Efficiency</span>
                              <span className="font-serif text-2xl text-text-primary">
                                {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.accuracyScore}/10
                              </span>
                            </div>
                            <div className="p-3.5 rounded-lg bg-surface-subtle border border-border-line text-center">
                              <span className="eyebrow-text text-[9px] block mb-1">Complexity</span>
                              <span className="font-mono text-xs font-bold text-text-primary">
                                {(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.timeComplexity}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submit result callout - No emdashes */}
                      {submitResult && (
                        <div className={`p-3.5 rounded-lg border ${
                          submitResult.submission.isCorrect 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-300'
                        }`}>
                          <span className="text-xs font-semibold">
                            {submitResult.submission.isCorrect 
                              ? `Verified Resolution: Awarded +${submitResult.score} XP` 
                              : "Verification Failed: Invariants not satisfied"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar - Rectangular buttons with rounded corners */}
            <div className="h-14 border-t border-border-line bg-surface-card flex items-center justify-between px-6 shrink-0 relative z-20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-green" />
                <span className="text-xs font-mono text-text-muted uppercase">SANDBOX NOMINAL</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleRun}
                  disabled={running || submitting}
                  className="btn-secondary text-xs py-2 px-4 rounded-lg cursor-pointer"
                >
                  <span>{running ? 'Processing...' : 'Run Diagnostics'}</span>
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={running || submitting}
                  className="btn-primary text-xs py-2 px-5 rounded-lg cursor-pointer"
                >
                  <span>{submitting ? 'Verifying...' : 'Submit Fix'}</span>
                  <span className="ml-1.5 font-mono text-xs">-&gt;</span>
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
