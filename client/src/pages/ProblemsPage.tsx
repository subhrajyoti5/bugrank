import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '@/services/challengeService';
import { submissionService } from '@/services/submissionService';
import { Challenge } from '@bugpulse/shared';
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
      <div className="min-h-[calc(100vh-80px)] bg-canvas flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-md border-2 border-border-line border-t-text-primary animate-spin mb-4" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Loading Mission Library...
        </span>
      </div>
    );
  }

  const completionPercent = challenges.length > 0 
    ? Math.round((solvedChallengeIds.size / challenges.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-canvas text-text-primary selection:bg-charcoal selection:text-offwhite dark:selection:bg-offwhite dark:selection:text-charcoal py-10 px-6 sm:px-10 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header - Centered */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 px-2.5 py-1 rounded-md border border-border-line bg-surface-subtle mb-3">
            <span className="eyebrow-text text-[10px]">INCIDENT REPOSITORY</span>
          </div>
          <h1 className="headline-section text-center">
            Mission Archives
          </h1>
          <p className="text-[1rem] text-text-secondary mt-1.5 max-w-xl text-center">
            Production incident scenarios. Isolate failures, inspect core dumps, and submit surgical minimal patches.
          </p>

          {/* Search Input - Centered */}
          <div className="w-full max-w-lg mt-6">
            <input
              type="text"
              placeholder="Search by incident keyword or error signature..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-card border border-border-line rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-primary transition-colors shadow-sm font-sans text-center"
            />
          </div>
        </div>

        {/* Filter Bar - Centered */}
        <div className="p-4 rounded-xl bg-surface-card border border-border-line flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider mr-2">
                Difficulty:
              </span>

              {['all', 'easy', 'medium', 'hard'].map((diff) => {
                const isSelected = diff === 'all' ? selectedDifficulty === '' : selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff === 'all' ? '' : diff)}
                    className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-text-primary text-canvas font-semibold'
                        : 'bg-surface-subtle hover:bg-surface-card text-text-secondary hover:text-text-primary border border-border-line'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider mr-2">
                Language:
              </span>

              {['all', 'cpp', 'java'].map((lang) => {
                const isSelected = lang === 'all' ? selectedLanguage === '' : selectedLanguage === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang === 'all' ? '' : lang)}
                    className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-text-primary text-canvas font-semibold'
                        : 'bg-surface-subtle hover:bg-surface-card text-text-secondary hover:text-text-primary border border-border-line'
                    }`}
                  >
                    {lang === 'all' ? 'All' : lang === 'cpp' ? 'C++20' : 'Java 21'}
                  </button>
                );
              })}
            </div>
          </div>

        {/* Layout: Main List (8 cols) + Sidebar (4 cols) */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Challenge List */}
          <div className="lg:col-span-8 space-y-3">
            {filteredChallenges.length === 0 ? (
              <div className="p-14 text-center rounded-xl border border-dashed border-border-line bg-surface-card">
                <h3 className="font-serif text-xl text-text-primary mb-2">No Matching Incidents</h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  No challenges matched your query or filter criteria. Try adjusting your search term.
                </p>
              </div>
            ) : (
              filteredChallenges.map((challenge, index) => {
                const isSolved = solvedChallengeIds.has(challenge.id);
                return (
                  <Link
                    key={challenge.id}
                    to={`/editor/${challenge.id}`}
                    className="block group"
                  >
                    <div className="card-frame p-5 hover:border-text-primary/40 transition-all duration-150 flex items-center justify-between gap-6">
                      
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Number index */}
                        <span className="font-mono text-xs text-text-muted font-semibold tracking-wider shrink-0 w-6">
                          {(index + 1).toString().padStart(2, '0')}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-[1.05rem] font-medium text-text-primary truncate group-hover:underline">
                              {challenge.title}
                            </h2>
                            {isSolved && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-status-green bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0 font-mono">
                                SOLVED
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-text-secondary font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getDifficultyBadge(challenge.difficulty)}`}>
                              {challenge.difficulty}
                            </span>
                            <span className="text-border-line">/</span>
                            <span className="text-[11px] uppercase text-text-muted">
                              {challenge.language === 'cpp' ? 'C++20' : challenge.language}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Score & Action */}
                      <div className="flex items-center gap-5 shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="font-serif text-2xl text-text-primary font-normal leading-none">
                            {challenge.baseScore}
                          </div>
                          <span className="eyebrow-text text-[9px]">MAX XP</span>
                        </div>

                        <div className="px-3 py-1.5 rounded-md border border-border-line bg-surface-subtle group-hover:bg-text-primary group-hover:text-canvas transition-colors font-mono text-xs font-semibold">
                          Open -&gt;
                        </div>
                      </div>

                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Sidebar Status (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Card */}
            <div className="card-frame p-6 bg-surface-card">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-border-line">
                <div>
                  <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Progress Overview</h2>
                  <p className="text-[11px] text-text-muted">Incident Resolution Metrics</p>
                </div>
                <span className="font-mono text-xs text-status-green font-semibold">ONLINE</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary font-medium">Clearance Rate</span>
                  <span className="font-mono font-bold text-text-primary">
                    {solvedChallengeIds.size} / {challenges.length} ({completionPercent}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-md bg-surface-subtle border border-border-line overflow-hidden">
                  <div
                    className="h-full bg-text-primary transition-all duration-500 rounded-md"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border-line text-center">
                  <span className="eyebrow-text block mb-1 text-[10px]">Solved</span>
                  <span className="font-serif text-2xl text-text-primary">
                    {solvedChallengeIds.size}
                  </span>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-border-line text-center">
                  <span className="eyebrow-text block mb-1 text-[10px]">Standing</span>
                  <span className="font-serif text-2xl text-text-primary">
                    {user ? "Top 12%" : "--"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border-line bg-canvas">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">Daily Goal</span>
                  <span className="font-mono text-[10px] text-text-muted">1 / 2</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  Resolve 1 memory anomaly and 1 concurrency race to maintain your daily streak.
                </p>
                <Link
                  to="/leaderboard"
                  className="w-full btn-secondary text-xs py-2 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <span>View Global Standing</span>
                  <span className="font-mono text-xs">-&gt;</span>
                </Link>
              </div>
            </div>

            {/* Directive Guidelines */}
            <div className="p-5 rounded-xl border border-border-line bg-surface-subtle text-xs space-y-2">
              <span className="eyebrow-text block text-[10px]">ENGINEERING DISCIPLINE</span>
              <p className="text-text-secondary leading-relaxed">
                Do not introduce global locks to eliminate data races. Seek fine-grained atomic sequencing, 
                acquire-release memory orders, and zero-allocation invariants.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProblemsPage;
