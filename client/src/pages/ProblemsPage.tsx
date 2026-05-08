import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge } from '@bugpulse/shared';
import { Search, Code2, Filter, ChevronRight, Trophy, Zap, Terminal } from 'lucide-react';
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
        return 'text-white/40 border-white/5';
      case 'medium':
        return 'text-white/60 border-white/10';
      case 'hard':
        return 'text-white border-white/20';
      default:
        return 'text-white/30 border-white/5';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-black flex items-center justify-center">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border border-white/10 border-t-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 radial-glow pointer-events-none" />
      
      {/* Animated Light Beams - Match LandingPage */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-cyan/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 pt-8 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header & Filters */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 text-white/40 mb-3">
                  <Terminal className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Operational Terminal</span>
                </div>
                <h1 className="text-5xl font-bold text-white tracking-tighter">Missions</h1>
              </div>

              <div className="relative group w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  placeholder="Query system database..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-premium pl-12 h-12 text-sm"
                />
              </div>
            </div>


            <div className="flex flex-wrap items-center gap-4 py-6 border-y border-white/[0.05]">
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mr-4">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter Engine</span>
              </div>
              
              <div className="flex items-center gap-2">
                {['easy', 'medium', 'hard'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                    className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                      selectedDifficulty === diff
                        ? 'bg-white text-black border-white'
                        : 'bg-white/[0.02] text-white/40 border-white/[0.05] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <div className="w-px h-4 bg-white/10 mx-2" />

              <div className="flex items-center gap-2">
                {['cpp', 'java'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(selectedLanguage === lang ? '' : lang)}
                    className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all duration-200 ${
                      selectedLanguage === lang
                        ? 'bg-white text-black border-white'
                        : 'bg-white/[0.02] text-white/40 border-white/[0.05] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* List */}
            <div className="lg:col-span-8 space-y-4">
              {filteredChallenges.length === 0 ? (
                <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl">
                  <div className="p-4 bg-white/5 rounded-full w-fit mx-auto mb-6">
                    <Search className="w-6 h-6 text-white/20" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">No results in sector</h3>
                  <p className="text-white/30 text-sm font-medium">Reconfigure filters or query parameters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredChallenges.map((challenge, index) => {
                    const isSolved = solvedChallengeIds.has(challenge.id);
                    return (
                      <Link
                        key={challenge.id}
                        to={`/editor/${challenge.id}`}
                        className="group block"
                      >
                        <div className={`p-6 rounded-xl flex items-center gap-6 border border-white/[0.05] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.02] ${isSolved ? 'bg-white/[0.01]' : 'bg-[#050505]'}`}>
                          <div className="hidden sm:flex items-center justify-center w-8 text-white/10 font-bold text-[10px] tracking-widest">
                            {(index + 1).toString().padStart(2, '0')}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-white transition-colors">
                                {challenge.title}
                              </h3>
                              {isSolved && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                              <span className={`px-2 py-0.5 rounded border ${getDifficultyStyles(challenge.difficulty)}`}>
                                {challenge.difficulty}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <Code2 className="w-3 h-3" />
                                {challenge.language}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-2xl font-bold text-white tracking-tighter">
                              {challenge.baseScore}
                            </div>
                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">XP</div>
                          </div>
                          
                          <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white group-hover:text-black transition-all text-white/20">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <div className="p-8 rounded-2xl border border-white/[0.05] bg-[#050505] sticky top-24">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-md font-bold text-white uppercase tracking-widest">Mission Status</h3>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Global Completion</span>
                      <span className="text-sm font-bold text-white tracking-tighter">{solvedChallengeIds.size} <span className="text-white/30">/ {challenges.length}</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                        style={{ width: `${(solvedChallengeIds.size / Math.max(challenges.length, 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Solved</div>
                      <div className="text-3xl font-bold text-white tracking-tighter">{solvedChallengeIds.size}</div>
                    </div>
                    <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Rank</div>
                      <div className="text-3xl font-bold text-white tracking-tighter">--</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-2xl border border-white/[0.05] bg-[#020202]">
                <h4 className="text-[10px] font-bold text-white/40 mb-6 uppercase tracking-[0.3em]">Directives</h4>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-6">
                   <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                      <Zap className="w-3.5 h-3.5 text-white" />
                   </div>
                   <div className="flex-1">
                      <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Daily Quota</div>
                      <div className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">0 / 2 Missions Solved</div>
                   </div>
                </div>
                <button className="w-full btn-premium py-2 text-[10px] font-bold uppercase tracking-widest">Access Roadmap</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;


