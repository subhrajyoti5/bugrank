import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardService } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@bugrank/shared';
import { Trophy, Medal, Award, Crown, Zap } from 'lucide-react';
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

    let height = 'h-32';
    let color = 'bg-slate-700';
    let ringColor = 'ring-slate-500';
    let icon = null;
    let order = 'order-2';

    if (rank === 1) {
      height = 'h-40';
      color = 'bg-gradient-to-b from-yellow-400/20 to-yellow-600/5 border-yellow-500/30';
      ringColor = 'ring-yellow-400';
      icon = <Crown className="h-6 w-6 text-yellow-400 absolute -top-8 left-1/2 -translate-x-1/2" />;
      order = 'order-2 scale-110 z-10';
    } else if (rank === 2) {
      height = 'h-32';
      color = 'bg-gradient-to-b from-slate-300/20 to-slate-500/5 border-slate-400/30';
      ringColor = 'ring-slate-300';
      icon = <Medal className="h-5 w-5 text-slate-300 absolute -top-7 left-1/2 -translate-x-1/2" />;
      order = 'order-1';
    } else if (rank === 3) {
      height = 'h-28';
      color = 'bg-gradient-to-b from-orange-400/20 to-orange-600/5 border-orange-500/30';
      ringColor = 'ring-orange-500';
      icon = <Award className="h-5 w-5 text-orange-500 absolute -top-7 left-1/2 -translate-x-1/2" />;
      order = 'order-3';
    }

    return (
      <div className={`relative flex flex-col items-center justify-end ${order} mb-4`}>
        <div className="relative mb-3">
          {icon}
          <img
            src={entry.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(entry.displayName)}
            alt={entry.displayName}
            className={`h-16 w-16 rounded-full ring-2 ${ringColor} shadow-lg`}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-700">
            #{rank}
          </div>
        </div>

        <div className={`w-36 ${height} ${color} backdrop-blur-md rounded-t-xl border-t border-x flex flex-col items-center justify-center p-2`}>
          <p className="font-bold text-slate-100 text-sm truncate w-full text-center">{entry.displayName}</p>
          <p className="text-orange-400 font-bold text-xs mt-1">{entry.totalScore} pts</p>
          <p className="text-slate-500 text-[10px]">{entry.successfulSubmissions} solved</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="page-container relative overflow-hidden">
      {/* Background glow for podium */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="content-wrapper max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-20 text-center animate-fade-in relative z-20">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 mb-2">
            Leaderboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Top debuggers climbing the ranks of excellence
          </p>
        </div>

        {/* Podium */}
        {entries.length > 0 && (
          <div className="flex justify-center items-end gap-4 mb-12 min-h-[220px] relative z-10">
            {entries.length >= 2 && <TopPodium entry={entries[1]} rank={2} />}
            {entries.length >= 1 && <TopPodium entry={entries[0]} rank={1} />}
            {entries.length >= 3 && <TopPodium entry={entries[2]} rank={3} />}
          </div>
        )}

        {/* User Rank Card */}
        {userRank > 0 && userRank > 20 && (
          <div className="glass border border-primary-500/30 rounded-xl p-4 mb-6 animate-slide-up flex items-center justify-between shadow-[0_0_15px_rgba(14,165,233,0.1)]">
            <div className="flex items-center gap-4">
              <div className="bg-primary-500/20 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-xs text-primary-300 font-medium uppercase tracking-wide">Your Current Standing</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">#{userRank}</span>
                  <span className="text-sm text-slate-400">Keep solving to climb up!</span>
                </div>
              </div>
            </div>
            <button onClick={handleSolveMore} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors">
              Solve More
            </button>
          </div>
        )}

        {/* Leaderboard Table/List */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {entries.length === 0 ? (
            <div className="text-center py-12 px-4 glass rounded-xl">
              <Trophy className="h-12 w-12 text-slate-400 dark:text-slate-700 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">No Rankings Yet</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Be the first to complete a challenge!</p>
            </div>
          ) : (
            <>
              {/* List Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="col-span-1">Rank</div>
                <div className="col-span-1"></div>
                <div className="col-span-6">User</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-2 text-right">Solved</div>
              </div>

              {entries.slice(3).map((entry, index) => {
                const rank = index + 4;
                const isMe = entry.userId === user?.id;
                return (
                  <div
                    key={entry.userId}
                    className={`grid grid-cols-12 gap-4 px-6 py-3 items-center rounded-xl border transition-all duration-200 ${isMe
                      ? 'bg-primary-500/10 border-primary-500/30 scale-[1.01]'
                      : 'glass hover:bg-slate-200/50 dark:hover:bg-slate-800/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                      }`}
                  >
                    <div className="col-span-1 font-mono text-slate-600 dark:text-slate-400 font-bold">#{rank}</div>
                    <div className="col-span-1">
                      <img
                        src={entry.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(entry.displayName)}
                        alt={entry.displayName}
                        className="h-8 w-8 rounded-full ring-1 ring-slate-300 dark:ring-slate-700"
                      />
                    </div>
                    <div className="col-span-6 flex items-center gap-2">
                      <span className={`font-medium ${isMe ? 'text-primary-400' : 'text-slate-900 dark:text-slate-200'}`}>
                        {entry.displayName}
                      </span>
                      {isMe && <span className="text-[10px] bg-primary-500/20 text-primary-300 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">You</span>}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="font-bold text-slate-900 dark:text-slate-200">{entry.totalScore}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-slate-600 dark:text-slate-400 text-sm">{entry.successfulSubmissions}</span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
