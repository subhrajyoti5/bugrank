import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { diffLines } from 'diff';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge, RunResult, SubmitResult } from '@bugrank/shared';
import { Play, Send, ArrowLeft, Clock, AlertCircle, CheckCircle, FileText, BookOpen, Users, List, Terminal, Sparkles, ChevronRight, Activity } from 'lucide-react';
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
    setActivePanel('result');

    try {
      const result = await submissionService.run(challenge.id, code);
      setRunResult(result);
      toast.success('Analysis complete');
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
        toast.success(`🎉 Correct! Earned ${result.score} points!`);
      } else {
        toast.error('Evaluation failed. Keep hunting!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'medium': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'hard': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!challenge) return null;

  const linesChanged = calculateLinesChanged();
  const timeTakenSec = Math.floor((Date.now() - startTimeRef.current) / 1000);

  const tabs = [
    { id: 'description' as TabType, label: 'Docs', icon: FileText },
    { id: 'editorial' as TabType, label: 'Editorial', icon: BookOpen },
    { id: 'solutions' as TabType, label: 'Solutions', icon: Users },
    { id: 'submissions' as TabType, label: 'History', icon: List },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#0b1120] text-slate-200 overflow-hidden">
      {/* Top Header */}
      <div className="h-14 border-b border-white/5 flex items-center px-4 bg-[#0b1120] shrink-0">
        <button
          onClick={() => navigate('/problems')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group"
        >
          <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>
        
        <div className="h-6 w-px bg-white/5 mx-4" />
        
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white tracking-tight">{challenge.title}</h1>
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${getDifficultyStyles(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-mono text-slate-300">
                {Math.floor(timeTakenSec / 60)}:{(timeTakenSec % 60).toString().padStart(2, '0')}
              </span>
           </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs Area */}
        <div className="w-[450px] border-r border-white/5 flex flex-col bg-[#0b1120] shrink-0">
          <div className="flex p-1 bg-white/[0.02] border-b border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'text-white bg-white/5 border border-white/5 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeTab === 'description' && (
              <div className="p-6 space-y-8">
                <section>
                   <div className="flex items-center gap-2 text-indigo-400 mb-4">
                      <FileText className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Objective</span>
                   </div>
                   <h2 className="text-2xl font-black text-white mb-4 leading-tight">{challenge.title}</h2>
                   <div className="text-slate-400 leading-relaxed text-sm whitespace-pre-wrap">
                    {challenge.description}
                   </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Points</div>
                      <div className="text-xl font-black text-white">{challenge.baseScore}</div>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Language</div>
                      <div className="text-xl font-black text-indigo-400 uppercase">{challenge.language}</div>
                   </div>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                   <div className="flex items-center gap-2 text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                   </div>
                   <ul className="space-y-2">
                      {[
                        "Hunt down the architectural flaw",
                        "Run tests for real-time AI analysis",
                        "Submit only when the fix is bulletproof",
                        "Avoid repeated failures to protect score"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-slate-400">
                           <div className="w-1 h-1 rounded-full bg-indigo-500/50 mt-1.5 shrink-0" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            )}
            
            {/* Fallback for other tabs */}
            {activeTab !== 'description' && (
              <div className="p-12 text-center space-y-4">
                 <Activity className="w-10 h-10 text-slate-700 mx-auto animate-pulse" />
                 <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">Encrypted Data Cluster</p>
                 <p className="text-slate-500 text-sm">Synchronizing with server. This sector will be available shortly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor & Panel Area */}
        <div className="flex-1 flex flex-col bg-[#0b1120]">
          <div className="flex-1 relative border-b border-white/5">
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
                padding: { top: 24, bottom: 24 },
                contextmenu: false,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                renderLineHighlight: 'all',
              }}
            />
          </div>

          {/* Bottom Diagnostics Panel */}
          <div className="h-72 flex flex-col bg-[#0b1120]">
            <div className="flex border-b border-white/5 px-2 bg-white/[0.01]">
              {[
                { id: 'testcase' as PanelType, label: 'Schema', icon: Terminal },
                { id: 'result' as PanelType, label: 'Diagnostics', icon: Activity }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePanel(p.id)}
                  className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                    activePanel === p.id 
                      ? 'text-white border-indigo-500' 
                      : 'text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                >
                  <p.icon className="w-3.5 h-3.5" />
                  {p.label}
                </button>
              ))}
              
              <div className="ml-auto flex items-center gap-4 px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                 <span>Diff: <span className="text-indigo-400">{linesChanged} lines</span></span>
                 <span>Attempts: <span className={attempts > 0 ? 'text-rose-400' : 'text-slate-400'}>{attempts}</span></span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {activePanel === 'testcase' && (
                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Expected Output Stream</label>
                    <pre className="bg-white/5 border border-white/5 rounded-xl p-4 text-xs font-mono text-cyan-400 overflow-x-auto">
                      {challenge.expectedOutput}
                    </pre>
                  </div>
                </div>
              )}

              {activePanel === 'result' && (
                <div className="space-y-5">
                  {!(runResult || submitResult) && !running && !submitting ? (
                    <div className="h-full flex flex-col items-center justify-center py-8 text-slate-600 opacity-50">
                       <Terminal className="w-8 h-8 mb-2" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Awaiting execution...</span>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Compilation / Running State */}
                      {(running || submitting) && (
                         <div className="flex items-center gap-3 text-indigo-400 mb-4 animate-pulse">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">Interpreting Fix...</span>
                         </div>
                      )}

                      {/* AI Diagnostics */}
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis) && (
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                           <div className="card-premium p-4 border-indigo-500/10 bg-indigo-500/[0.02]">
                              <div className="flex items-center gap-2 mb-4">
                                 <Sparkles className="w-4 h-4 text-indigo-400" />
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Feedback</span>
                              </div>
                              <p className="text-slate-400 text-xs leading-relaxed italic">
                                "{(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.feedback}"
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-3">
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                 <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Logic Score</div>
                                 <div className="text-xl font-black text-white">{(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.accuracyScore}/10</div>
                              </div>
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                 <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Complexity</div>
                                 <div className="text-xs font-mono font-bold text-indigo-400 truncate">{(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.timeComplexity}</div>
                              </div>
                           </div>
                        </div>
                      )}

                      {/* Status */}
                      {submitResult && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
                          submitResult.submission.isCorrect 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}>
                           {submitResult.submission.isCorrect ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                           <span className="text-sm font-black uppercase tracking-widest">
                             {submitResult.submission.isCorrect ? `Fix Verified — ${submitResult.score} pts` : "Validation Failed"}
                           </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terminal Actions */}
            <div className="h-16 border-t border-white/5 bg-[#0b1120] flex items-center justify-between px-6 shrink-0">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Ready</span>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button
                    onClick={handleRun}
                    disabled={running || submitting}
                    className="btn-premium py-2 px-6 text-xs h-10 group"
                  >
                    {running ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {running ? 'Running' : 'Dry Run'}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running || submitting}
                    className="btn-primary-premium py-2 px-8 text-xs h-10 group"
                  >
                    {submitting ? <Activity className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? 'Authenticating' : 'Final Submission'}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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

