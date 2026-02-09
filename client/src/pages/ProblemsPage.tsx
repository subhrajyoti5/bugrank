import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge } from '@bugrank/shared';
import { Search, Rocket, Code2, Filter } from 'lucide-react';
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'medium':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'hard':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container relative overflow-hidden">
      {/* Subtle background glow spots */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-200/50 dark:border-white/5 sticky top-0 z-20 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg border border-primary-500/20">
              <Rocket className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Challenges</h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Solve bugs, climb the ranks</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-200 text-sm rounded-xl focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 block w-full pl-10 p-2.5 transition-all outline-none"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="border-t border-slate-200/50 dark:border-white/5 bg-slate-50/80 dark:bg-[#020617]/50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mr-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters:</span>
            </div>
            {['easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${selectedDifficulty === diff
                  ? 'bg-primary-500/20 text-primary-400 border-primary-500/40 shadow-[0_0_10px_rgba(14,165,233,0.2)]'
                  : 'bg-slate-200/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-2" />

            {['cpp', 'java'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(selectedLanguage === lang ? '' : lang)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${selectedLanguage === lang
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-200/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Problems List */}
          <div className="flex-1 space-y-3">
            {filteredChallenges.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center border-dashed border-slate-300 dark:border-slate-800">
                <div className="bg-slate-300/50 dark:bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-500 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 dark:text-slate-300 mb-2">No challenges found</h3>
                <p className="text-sm text-slate-600 dark:text-slate-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider pl-8">
                  <div className="col-span-1">No.</div>
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Difficulty</div>
                  <div className="col-span-2">Language</div>
                  <div className="col-span-2 text-right">Score</div>
                </div>

                <div className="space-y-2">
                  {filteredChallenges.map((challenge, index) => (
                    <Link
                      key={challenge.id}
                      to={`/editor/${challenge.id}`}
                      className="group block relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                      <div className="relative glass rounded-xl border border-slate-200 dark:border-white/5 hover:border-primary-400 dark:hover:border-primary-500/30 hover:bg-slate-100 dark:hover:bg-slate-800/60 p-4 transition-all duration-300 group-hover:translate-x-1">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1">
                            <span className="text-slate-500 font-mono text-sm leading-none">#{index + 1}</span>
                          </div>
                          <div className="col-span-5">
                            <h3 className="text-slate-200 font-medium text-base group-hover:text-primary-400 transition-colors flex items-center gap-2">
                              {challenge.title}
                            </h3>
                          </div>
                          <div className="col-span-2">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs uppercase font-medium">
                              <Code2 className="h-3.5 w-3.5" />
                              {challenge.language}
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <div className="flex items-center justify-end gap-1 text-slate-300 font-medium">
                              <span>{challenge.baseScore}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar - Stats */}
          <div className="w-72 hidden lg:block space-y-6">
            <div className="glass rounded-xl p-5 border border-slate-200 dark:border-white/5 sticky top-40 animate-slide-up">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                Your Progress
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800/50">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-slate-600 dark:text-slate-400 text-xs">Total Solved</span>
                    <span className="text-slate-900 dark:text-slate-200 font-bold text-lg">{solvedChallengeIds.size} <span className="text-slate-400 dark:text-slate-600 text-xs font-normal">/ {filteredChallenges.length}</span></span>
                  </div>
                  <div className="w-full bg-slate-300 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(solvedChallengeIds.size / Math.max(filteredChallenges.length, 1)) * 100}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800/50 text-center">
                    <span className="text-xs text-slate-600 dark:text-slate-500 block mb-1">Easy</span>
                    <span className="text-emerald-400 font-bold">{challenges.filter(c => c.difficulty === 'easy' && solvedChallengeIds.has(c.id)).length}</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800/50 text-center">
                    <span className="text-xs text-slate-600 dark:text-slate-500 block mb-1">Hard</span>
                    <span className="text-rose-400 font-bold">{challenges.filter(c => c.difficulty === 'hard' && solvedChallengeIds.has(c.id)).length}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
