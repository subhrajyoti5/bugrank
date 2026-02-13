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
        return 'text-indigo-cyan bg-indigo-cyan/10 border-indigo-cyan/20';
      case 'medium':
        return 'text-cyan-violet bg-cyan-violet/10 border-cyan-violet/20';
      case 'hard':
        return 'text-electric-indigo bg-electric-indigo/10 border-electric-indigo/20';
      default:
        return 'text-premium-muted bg-premium-muted/10 border-premium-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-indigo"></div>
      </div>
    );
  }

  return (
    <div className="page-container relative overflow-hidden">
      {/* Subtle background glow spots */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-electric-indigo/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-violet/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="border-b border-electric-indigo/10 sticky top-0 z-20 bg-deep-navy/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-electric-indigo/10 rounded-lg border border-electric-indigo/20">
              <Rocket className="h-5 w-5 text-electric-indigo" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-premium-text tracking-tight">Challenges</h1>
              <p className="text-xs text-premium-muted">Solve bugs, climb the ranks</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-premium-muted group-focus-within:text-electric-indigo transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-premium-slate/50 border border-premium-muted/20 text-premium-text text-sm rounded-xl focus:ring-2 focus:ring-electric-indigo/30 focus:border-electric-indigo block w-full pl-10 p-2.5 transition-all outline-none"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="border-t border-electric-indigo/10 bg-premium-slate/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-xs font-medium text-premium-muted mr-2">
              <Filter className="h-3.5 w-3.5" />
              <span>Filters:</span>
            </div>
            {['easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${selectedDifficulty === diff
                  ? 'bg-electric-indigo/20 text-electric-indigo border-electric-indigo/40 shadow-[0_0_10px_rgba(80,80,200,0.2)]'
                  : 'bg-premium-slate/50 text-premium-muted border-premium-muted/30 hover:bg-premium-slate hover:border-electric-indigo/20'
                  }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}

            <div className="w-px h-4 bg-electric-indigo/10 mx-2" />

            {['cpp', 'java'].map(lang => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(selectedLanguage === lang ? '' : lang)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${selectedLanguage === lang
                  ? 'bg-cyan-violet/20 text-cyan-violet border-cyan-violet/40 shadow-[0_0_10px_rgba(200,80,200,0.2)]'
                  : 'bg-premium-slate/50 text-premium-muted border-premium-muted/30 hover:bg-premium-slate hover:border-electric-indigo/20'
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
              <div className="glass rounded-2xl p-12 text-center border-dashed border-premium-muted/30">
                <div className="bg-premium-muted/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-premium-muted" />
                </div>
                <h3 className="text-lg font-medium text-premium-text mb-2">No challenges found</h3>
                <p className="text-sm text-premium-muted">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-premium-muted uppercase tracking-wider pl-8">
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
                      <div className="absolute inset-0 bg-gradient-to-r from-electric-indigo/0 via-electric-indigo/5 to-electric-indigo/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                      <div className="relative glass rounded-xl border border-premium-muted/10 hover:border-electric-indigo hover:bg-premium-slate/60 p-4 transition-all duration-300 group-hover:translate-x-1">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          <div className="col-span-1">
                            <span className="text-premium-muted font-mono text-sm leading-none">#{index + 1}</span>
                          </div>
                          <div className="col-span-5">
                            <h3 className="text-premium-text font-medium text-base group-hover:text-electric-indigo transition-colors flex items-center gap-2">
                              {challenge.title}
                            </h3>
                          </div>
                          <div className="col-span-2">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getDifficultyColor(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center gap-1.5 text-premium-muted text-xs uppercase font-medium">
                              <Code2 className="h-3.5 w-3.5" />
                              {challenge.language}
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            <div className="flex items-center justify-end gap-1 text-premium-text font-medium">
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
            <div className="glass rounded-xl p-5 border border-electric-indigo/10 sticky top-40 animate-slide-up">
              <h3 className="text-sm font-semibold text-premium-text mb-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-electric-indigo" />
                Your Progress
              </h3>

              <div className="space-y-4">
                <div className="bg-premium-muted/10 rounded-lg p-3 border border-premium-muted/20">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-premium-muted text-xs">Total Solved</span>
                    <span className="text-premium-text font-bold text-lg">{solvedChallengeIds.size} <span className="text-premium-muted text-xs font-normal">/ {filteredChallenges.length}</span></span>
                  </div>
                  <div className="w-full bg-premium-muted/30 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-cyan h-full transition-all duration-500" style={{ width: `${(solvedChallengeIds.size / Math.max(filteredChallenges.length, 1)) * 100}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-premium-muted/10 rounded-lg p-3 border border-premium-muted/20 text-center">
                    <span className="text-xs text-premium-muted block mb-1">Easy</span>
                    <span className="text-indigo-cyan font-bold">{challenges.filter(c => c.difficulty === 'easy' && solvedChallengeIds.has(c.id)).length}</span>
                  </div>
                  <div className="bg-premium-muted/10 rounded-lg p-3 border border-premium-muted/20 text-center">
                    <span className="text-xs text-premium-muted block mb-1">Hard</span>
                    <span className="text-cyan-violet font-bold">{challenges.filter(c => c.difficulty === 'hard' && solvedChallengeIds.has(c.id)).length}</span>
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
