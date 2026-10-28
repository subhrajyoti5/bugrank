import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardService } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@bugpulse/shared';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number>(0);

  const handleSolveMore = () => {
    navigate('/problems');
  };

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardService.getTop(20);
      setEntries(data);

      if (user) {
        const rank = await leaderboardService.getUserRank(user.id);
        setUserRank(rank);
      }
    } catch (error) {
      toast.error('Failed to load leaderboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const TopPodium = ({ entry, rank }: { entry: LeaderboardEntry; rank: number }) => {
    if (!entry) return null;

    let height = 'h-36';
    let podiumBg = 'bg-surface-card border-border-line';
    let order = 'order-2';
    let rankBadge = 'bg-surface-subtle text-text-primary border-border-line';

    if (rank === 1) {
      height = 'h-44';
      podiumBg = 'bg-surface-card border-text-primary/30 shadow-card-hover';
      order = 'order-2 z-10';
      rankBadge = 'bg-text-primary text-canvas border-transparent';
    } else if (rank === 2) {
      height = 'h-36';
      podiumBg = 'bg-surface-card border-border-line';
      order = 'order-1';
    } else if (rank === 3) {
      height = 'h-32';
      podiumBg = 'bg-surface-card border-border-line';
      order = 'order-3';
    }

    return (
      <div className={`relative flex flex-col items-center justify-end ${order} mb-2 w-full max-w-[200px]`}>
        <div className="relative mb-5 flex flex-col items-center">
          <div className="relative">
            <img
              src={entry.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.displayName)}&background=1C1B1F&color=FFFFF5`}
              alt={entry.displayName}
              className="h-18 w-18 rounded-lg object-cover border border-border-line shadow-sm"
            />
            <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono px-2 py-0.5 rounded border shadow-sm ${rankBadge}`}>
              #{rank}
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="font-medium text-text-primary text-sm truncate max-w-[150px]">
              {entry.displayName}
            </p>
            <p className="text-[11px] text-text-muted font-mono">
              {entry.successfulSubmissions} SOLVED
            </p>
          </div>
        </div>

        {/* Podium Block */}
        <div className={`w-full ${height} ${podiumBg} rounded-t-lg border-t border-x flex flex-col items-center justify-center p-4 transition-all duration-200`}>
          <span className="font-serif text-3xl font-normal text-text-primary leading-none">
            {entry.totalScore}
          </span>
          <span className="eyebrow-text text-[9px] mt-1">XP EARNED</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-canvas flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-md border-2 border-border-line border-t-text-primary animate-spin mb-4" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Compiling Global Leaderboard...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-text-primary selection:bg-charcoal selection:text-offwhite dark:selection:bg-offwhite dark:selection:text-charcoal py-10 px-6 sm:px-10 lg:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Centered */}
        <div className="text-center mb-14 flex flex-col items-center">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-md border border-border-line bg-surface-subtle mb-3">
            <span className="eyebrow-text text-[10px]">ENGINEERING RANKINGS</span>
          </div>
          <h1 className="headline-section mb-2 text-center">
            Global Standings
          </h1>
          <p className="text-[1rem] text-text-secondary max-w-lg mx-auto text-center">
            Rankings calibrated by surgical patch economy, incident resolution speed, and code invariance.
          </p>
        </div>

        {/* Podium for Top 3 - Centered */}
        {entries.length > 0 && (
          <div className="flex justify-center items-end gap-3 sm:gap-6 mb-14 px-4 pt-4 border-b border-border-line">
            {entries.length >= 2 && <TopPodium entry={entries[1]} rank={2} />}
            {entries.length >= 1 && <TopPodium entry={entries[0]} rank={1} />}
            {entries.length >= 3 && <TopPodium entry={entries[2]} rank={3} />}
          </div>
        )}

        {/* User Rank Card - Centered */}
        {userRank > 0 && (
          <div className="card-frame p-6 sm:p-7 bg-surface-card mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm text-center sm:text-left">
            <div className="flex flex-col items-center sm:items-start">
              <span className="eyebrow-text block mb-1 text-[10px]">YOUR CURRENT STANDING</span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl text-text-primary">
                  #{userRank}
                </span>
                <span className="text-sm text-text-secondary">
                  {userRank <= 10 ? 'Tier 1 Operative' : 'Keep resolving incidents to ascend rankings.'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSolveMore}
              className="btn-primary text-xs py-2.5 px-6 shrink-0 cursor-pointer rounded-lg"
            >
              <span>Solve Next Incident</span>
              <span className="ml-2 font-mono text-xs">-&gt;</span>
            </button>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="card-frame bg-surface-card overflow-hidden">
          <div className="p-4 border-b border-border-line flex items-center justify-between bg-surface-subtle">
            <span className="eyebrow-text text-[10px]">LEADERBOARD DIRECTORY</span>
            <span className="font-mono text-xs text-text-muted">TOP 20 OPERATIVES</span>
          </div>

          {entries.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="font-serif text-lg text-text-primary mb-1">No Operative Data Recorded</h3>
              <p className="text-xs text-text-secondary">Be the first to record a solution.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-line">
              {/* Header row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-2.5 text-[10px] font-semibold text-text-muted uppercase tracking-wider bg-surface-subtle/50 font-mono">
                <div className="col-span-2 sm:col-span-1">Rank</div>
                <div className="col-span-6 sm:col-span-7">User</div>
                <div className="col-span-2 text-right">Solved</div>
                <div className="col-span-2 text-right">Score</div>
              </div>

              {entries.map((entry, index) => {
                const rank = index + 1;
                const isMe = entry.userId === user?.id;

                return (
                  <div
                    key={entry.userId}
                    className={`grid grid-cols-12 gap-4 px-6 py-3.5 items-center transition-colors ${
                      isMe
                        ? 'bg-amber-500/5 font-medium'
                        : 'hover:bg-surface-subtle'
                    }`}
                  >
                    {/* Rank */}
                    <div className="col-span-2 sm:col-span-1 font-mono text-xs font-semibold text-text-muted">
                      #{rank.toString().padStart(2, '0')}
                    </div>

                    {/* Operative */}
                    <div className="col-span-6 sm:col-span-7 flex items-center gap-3 min-w-0">
                      <img
                        src={entry.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.displayName)}&background=1C1B1F&color=FFFFF5`}
                        alt={entry.displayName}
                        className="h-7 w-7 rounded-md border border-border-line object-cover shrink-0"
                      />
                      <div className="truncate flex items-center gap-2">
                        <span className={`text-sm truncate ${isMe ? 'font-semibold text-text-primary' : 'text-text-primary'}`}>
                          {entry.displayName}
                        </span>
                        {isMe && (
                          <span className="text-[9px] bg-text-primary text-canvas px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                            YOU
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Solved */}
                    <div className="col-span-2 text-right font-mono text-xs text-text-secondary">
                      {entry.successfulSubmissions}
                    </div>

                    {/* XP */}
                    <div className="col-span-2 text-right font-serif text-lg text-text-primary leading-none">
                      {entry.totalScore}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeaderboardPage;
