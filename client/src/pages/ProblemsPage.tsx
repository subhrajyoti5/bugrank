import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge } from '@bugrank/shared';
import { Search, Rocket, Code2, Filter, CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

const ProblemsPage: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [solvedChallengeIds, setSolvedChallengeIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadChallenges();
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadChallenges = async () => {
    try {
      const data = await challengeService.getAll();
      setChallenges(data);
    } catch (error) {
      toast.error('Failed to load challenges');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;
    try {
      const submissions = await submissionService.getUserSubmissions(user.id);
      const solvedIds = new Set<string>(
        submissions
          .filter((sub: any) => sub.isCorrect)
          .map((sub: any) => sub.challengeId)
      );
      setSolvedChallengeIds(solvedIds);
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDifficulty = !selectedDifficulty || challenge.difficulty === selectedDifficulty;
    const matchLanguage = !selectedLanguage || challenge.language === selectedLanguage;
    return matchSearch && matchDifficulty && matchLanguage;
  });

  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'medium':
        return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
      case 'hard':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="h-8 w-8 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-200 selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header & Filters */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <Rocket className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Training Ground</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Challenges</h1>
              </div>

              <div className="relative group w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-premium pl-12 h-12"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 py-4 border-y border-white/5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mr-4">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </div>
              
              <div className="flex items-center gap-2">
                {['easy', 'medium', 'hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight border transition-all duration-300 ${
                      selectedDifficulty === diff
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-white/5 mx-2" />

              <div className="flex items-center gap-2">
                {['cpp', 'java'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(selectedLanguage === lang ? '' : lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight border transition-all duration-300 ${
                      selectedLanguage === lang
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                        : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* List */}
            <div className="lg:col-span-8 space-y-4">
              {filteredChallenges.length === 0 ? (
                <div className="card-premium py-20 text-center border-dashed">
                  <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-6">
                    <Search className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredChallenges.map((challenge, index) => {
                    const isSolved = solvedChallengeIds.has(challenge.id);
                    return (
                      <Link
                        key={challenge.id}
                        to={`/editor/${challenge.id}`}
                        className="group block"
                      >
                        <div className={`card-premium p-4 flex items-center gap-6 border border-white/5 hover:border-indigo-500/30 transition-all ${isSolved ? 'bg-emerald-500/5' : ''}`}>
                          <div className="hidden sm:flex items-center justify-center w-10 text-slate-600 font-mono text-sm">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-white truncate group-hover:text-indigo-400 transition-colors">
                                {challenge.title}
                              </h3>
                              {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                              <span className={`px-2 py-0.5 rounded-md border font-bold uppercase tracking-tighter ${getDifficultyStyles(challenge.difficulty)}`}>
                                {challenge.difficulty}
                              </span>
                              <div className="flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
                                <Code2 className="w-3 h-3" />
                                {challenge.language}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                              {challenge.baseScore}
                            </div>
                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Points</div>
                          </div>
                          
                          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all text-slate-500">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="card-premium border border-white/10 bg-white/[0.03] sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <Trophy className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Your Progress</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completion</span>
                      <span className="text-sm font-bold text-white">{solvedChallengeIds.size} <span className="text-slate-500 font-medium">/ {challenges.length}</span></span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000 ease-out" 
                        style={{ width: `${(solvedChallengeIds.size / Math.max(challenges.length, 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Solved</div>
                      <div className="text-2xl font-black text-white">{solvedChallengeIds.size}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Rank</div>
                      <div className="text-2xl font-black text-indigo-400">#--</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-premium border-white/5">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Daily Goal</h4>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
                   <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Zap className="w-4 h-4 text-indigo-400" />
                   </div>
                   <div className="flex-1">
                      <div className="text-xs font-bold text-white mb-0.5">Solve 2 Problems</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-tighter">0 / 2 Completed</div>
                   </div>
                </div>
                <button className="w-full btn-premium py-2 text-xs font-bold uppercase tracking-widest">View Roadmap</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;

