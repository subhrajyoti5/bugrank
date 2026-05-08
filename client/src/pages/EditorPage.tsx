import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { diffLines } from 'diff';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge, RunResult, SubmitResult } from '@bugpulse/shared';
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
        toast.success(`Correct fix! +${result.score} XP`);
      } else {
        toast.error('Validation failed.');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-white/40 border-white/5';
      case 'medium': return 'text-white/60 border-white/10';
      case 'hard': return 'text-white border-white/20';
      default: return 'text-white/30 border-white/5';
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border border-white/10 border-t-white animate-spin" />
      </div>
    );
  }

  if (!challenge) return null;

  const linesChanged = calculateLinesChanged();
  const timeTakenSec = Math.floor((Date.now() - startTimeRef.current) / 1000);

  const tabs = [
    { id: 'description' as TabType, label: 'Docs', icon: FileText },
    { id: 'editorial' as TabType, label: 'Intel', icon: BookOpen },
    { id: 'solutions' as TabType, label: 'Peers', icon: Users },
    { id: 'submissions' as TabType, label: 'Logs', icon: List },
  ];

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-14 border-b border-white/[0.05] flex items-center px-6 bg-black shrink-0 relative z-10">
        <button
          onClick={() => navigate('/problems')}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-all group"
        >
          <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Exit</span>
        </button>
        
        <div className="h-4 w-px bg-white/10 mx-6" />
        
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white tracking-tight">{challenge.title}</h1>
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${getDifficultyStyles(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-6">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.02] rounded-full border border-white/[0.05]">
              <Clock className="w-3 h-3 text-white/40" />
              <span className="text-[10px] font-mono font-bold text-white/60">
                {Math.floor(timeTakenSec / 60)}:{(timeTakenSec % 60).toString().padStart(2, '0')}
              </span>
           </div>
        </div>
      </div>

      {/* Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs Area */}
        <div className="w-[400px] border-r border-white/[0.05] flex flex-col bg-black shrink-0">
          <div className="flex p-1 bg-white/[0.01] border-b border-white/[0.05]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                  activeTab === tab.id
                    ? 'text-white bg-white/5 shadow-sm'
                    : 'text-white/30 hover:text-white/60'
                }`}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#050505]">
            {activeTab === 'description' && (
              <div className="p-8 space-y-10">
                <section>
                   <div className="flex items-center gap-2 text-white/20 mb-4">
                      <Terminal className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Briefing</span>
                   </div>
                   <h2 className="text-3xl font-bold text-white mb-6 leading-[1.1] tracking-tighter">{challenge.title}</h2>
                   <div className="text-white/50 leading-relaxed text-sm font-medium whitespace-pre-wrap">
                    {challenge.description}
                   </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">XP Reward</div>
                      <div className="text-2xl font-bold text-white tracking-tighter">{challenge.baseScore}</div>
                   </div>
                   <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Runtime</div>
                      <div className="text-2xl font-bold text-white tracking-tighter uppercase">{challenge.language}</div>
                   </div>
                </div>

                <div className="p-6 rounded-xl bg-white/[0.01] border border-white/[0.05] space-y-4">
                   <div className="flex items-center gap-2 text-white/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Rules of Engagement</span>
                   </div>
                   <ul className="space-y-3">
                      {[
                        "Isolate the logical inconsistency",
                        "Verify fix via diagnostic dry runs",
                        "Final submission requires 100% test pass",
                        "Inefficient fixes will impact final XP"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-white/40 font-medium">
                           <div className="w-1 h-1 rounded-full bg-white/20 mt-1.5 shrink-0" />
                           {item}
                        </li>
                      ))}
                   </ul>
                </div>
              </div>
            )}
            
            {activeTab !== 'description' && (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4">
                 <div className="p-4 bg-white/[0.02] rounded-full border border-white/[0.05]">
                    <Activity className="w-6 h-6 text-white/10 animate-pulse" />
                 </div>
                 <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">Sector Locked</p>
                 <p className="text-white/40 text-sm font-medium">This tactical data is currently being synthesized.</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor & Panel Area */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 relative border-b border-white/[0.05]">
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
                backgroundColor: '#000000',
              }}
            />
          </div>

          {/* Bottom Diagnostics Panel */}
          <div className="h-80 flex flex-col bg-black">
            <div className="flex border-b border-white/[0.05] px-2 bg-white/[0.01]">
              {[
                { id: 'testcase' as PanelType, label: 'Schema', icon: Terminal },
                { id: 'result' as PanelType, label: 'Diagnostics', icon: Activity }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setActivePanel(p.id)}
                  className={`px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b flex items-center gap-2 ${
                    activePanel === p.id 
                      ? 'text-white border-white' 
                      : 'text-white/30 border-transparent hover:text-white/60'
                  }`}
                >
                  <p.icon className="w-3 h-3" />
                  {p.label}
                </button>
              ))}
              
              <div className="ml-auto flex items-center gap-6 px-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                 <span>Diff: <span className="text-white/60">{linesChanged} nodes</span></span>
                 <span>Attempts: <span className={attempts > 0 ? 'text-white' : 'text-white/20'}>{attempts}</span></span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#020202]">
              {activePanel === 'testcase' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] block mb-4">Target Output Stream</label>
                    <pre className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 text-xs font-mono text-white/80 overflow-x-auto">
                      {challenge.expectedOutput}
                    </pre>
                  </div>
                </div>
              )}

              {activePanel === 'result' && (
                <div className="space-y-6">
                  {!(runResult || submitResult) && !running && !submitting ? (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-white/10">
                       <Terminal className="w-6 h-6 mb-4" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Standby for execution</span>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Compilation / Running State */}
                      {(running || submitting) && (
                         <div className="flex items-center gap-3 text-white/60 mb-6 animate-pulse">
                            <Activity className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Analyzing Logic...</span>
                         </div>
                      )}

                      {/* AI Diagnostics */}
                      {(runResult?.aiAnalysis || submitResult?.aiAnalysis) && (
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                           <div className="p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
                              <div className="flex items-center gap-2 mb-6">
                                 <Sparkles className="w-3.5 h-3.5 text-white/40" />
                                 <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Neural Insights</span>
                              </div>
                              <p className="text-white/60 text-xs leading-relaxed italic font-medium">
                                "{(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.feedback}"
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05]">
                                 <div className="text-[9px] font-bold text-white/20 uppercase mb-2 tracking-widest">Efficiency</div>
                                 <div className="text-2xl font-bold text-white tracking-tighter">{(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.accuracyScore}/10</div>
                              </div>
                              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05]">
                                 <div className="text-[9px] font-bold text-white/20 uppercase mb-2 tracking-widest">Complexity</div>
                                 <div className="text-xs font-mono font-bold text-white truncate">{(runResult?.aiAnalysis || submitResult?.aiAnalysis)?.timeComplexity}</div>
                              </div>
                           </div>
                        </div>
                      )}

                      {/* Status */}
                      {submitResult && (
                        <div className={`p-6 rounded-xl flex items-center gap-4 border ${
                          submitResult.submission.isCorrect 
                            ? 'bg-white/5 border-white/20 text-white' 
                            : 'bg-white/[0.02] border-white/5 text-white/40'
                        }`}>
                           {submitResult.submission.isCorrect ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                           <span className="text-xs font-bold uppercase tracking-[0.3em]">
                             {submitResult.submission.isCorrect ? `Verified Resolution — +${submitResult.score} XP` : "System Rejected Fix"}
                           </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Terminal Actions */}
            <div className="h-16 border-t border-white/[0.05] bg-black flex items-center justify-between px-8 shrink-0 relative z-10">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                     <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Neural Link Stable</span>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button
                    onClick={handleRun}
                    disabled={running || submitting}
                    className="btn-premium py-2 px-8 text-[10px] font-bold uppercase tracking-widest h-10 group"
                  >
                    {running ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    {running ? 'Processing' : 'Diagnostic'}
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={running || submitting}
                    className="btn-primary-premium py-2 px-10 text-[10px] font-bold uppercase tracking-widest h-10 group"
                  >
                    {submitting ? <Activity className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    {submitting ? 'Authenticating' : 'Finalize Fix'}
                    <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
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

