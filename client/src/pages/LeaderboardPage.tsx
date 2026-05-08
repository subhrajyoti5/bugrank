import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardService } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@bugpulse/shared';
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
    let color = 'bg-white/[0.02] border-white/5';
    let ringColor = 'ring-white/10';
    let icon = null;
    let order = 'order-2';

    if (rank === 1) {
      height = 'h-40';
      color = 'bg-white/5 border-white/20';
      ringColor = 'ring-white/40';
      icon = <Crown className="h-6 w-6 text-white absolute -top-8 left-1/2 -translate-x-1/2" />;
      order = 'order-2 scale-110 z-10';
    } else if (rank === 2) {
      height = 'h-32';
      color = 'bg-white/[0.03] border-white/10';
      ringColor = 'ring-white/20';
      icon = <Medal className="h-5 w-5 text-white/60 absolute -top-7 left-1/2 -translate-x-1/2" />;
      order = 'order-1';
    } else if (rank === 3) {
      height = 'h-28';
      color = 'bg-white/[0.01] border-white/[0.05]';
      ringColor = 'ring-white/10';
      icon = <Award className="h-5 w-5 text-white/40 absolute -top-7 left-1/2 -translate-x-1/2" />;
      order = 'order-3';
    }

    return (
      <div className={`relative flex flex-col items-center justify-end ${order} mb-4`}>
        <div className="relative mb-6">
          {icon}
          <img
            src={entry.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(entry.displayName)}
            alt={entry.displayName}
            className={`h-20 w-20 rounded-full ring-2 ${ringColor} shadow-2xl transition-all duration-500`}
          />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            RANK {rank}
          </div>
        </div>

        <div className={`w-40 ${height} ${color} backdrop-blur-md rounded-t-2xl border-t border-x flex flex-col items-center justify-center p-4 transition-all duration-500`}>
          <p className="font-bold text-white text-sm truncate w-full text-center tracking-tight">{entry.displayName}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-white font-bold text-lg tracking-tighter">{entry.totalScore}</span>
            <span className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">XP</span>
          </div>
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">{entry.successfulSubmissions} SOLVED</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-black flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border border-white/10 border-t-white animate-spin" />
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
        <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="mb-20 text-center">
          <div className="flex items-center justify-center gap-2 text-white/40 mb-3">
             <Trophy className="w-4 h-4" />
             <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Global Ranking Protocol</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter">Leaderboard</h1>
        </div>

        {/* Podium */}
        {entries.length > 0 && (
          <div className="flex justify-center items-end gap-2 mb-20 min-h-[300px]">
            {entries.length >= 2 && <TopPodium entry={entries[1]} rank={2} />}
            {entries.length >= 1 && <TopPodium entry={entries[0]} rank={1} />}
            {entries.length >= 3 && <TopPodium entry={entries[2]} rank={3} />}
          </div>
        )}

        {/* User Rank Card */}
        {userRank > 0 && userRank > 20 && (
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] mb-12 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mb-2">Internal Standing</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-white tracking-tighter">#{userRank}</span>
                  <span className="text-sm text-white/40 font-medium">Continue deployment to optimize ranking.</span>
                </div>
              </div>
            </div>
            <button onClick={handleSolveMore} className="btn-premium px-8 py-3 text-[10px] font-bold uppercase tracking-widest shrink-0">
              New Mission
            </button>
          </div>
        )}

        {/* Leaderboard Table/List */}
        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <Trophy className="h-12 w-12 text-white/10 mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">No operative data</h3>
              <p className="text-white/30 text-sm font-medium">Be the first to establish a ranking presence.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* List Header */}
              <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] border-b border-white/[0.05]">
                <div className="col-span-1">Rank</div>
                <div className="col-span-1"></div>
                <div className="col-span-6">Operative</div>
                <div className="col-span-2 text-right">XP</div>
                <div className="col-span-2 text-right">Resolved</div>
              </div>

              {entries.slice(3).map((entry, index) => {
                const rank = index + 4;
                const isMe = entry.userId === user?.id;
                return (
                  <div
                    key={entry.userId}
                    className={`grid grid-cols-12 gap-4 px-8 py-4 items-center rounded-xl border transition-all duration-300 ${isMe
                      ? 'bg-white/[0.05] border-white/20'
                      : 'bg-[#050505] border-white/[0.05] hover:border-white/10 hover:bg-white/[0.02]'
                      }`}
                  >
                    <div className="col-span-1 font-bold text-white/20 text-xs tracking-widest">
                       {rank.toString().padStart(2, '0')}
                    </div>
                    <div className="col-span-1">
                      <img
                        src={entry.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(entry.displayName)}
                        alt={entry.displayName}
                        className="h-10 w-10 rounded-full border border-white/10"
                      />
                    </div>
                    <div className="col-span-6 flex items-center gap-3">
                      <span className={`font-bold text-sm tracking-tight ${isMe ? 'text-white' : 'text-white/80'}`}>
                        {entry.displayName}
                      </span>
                      {isMe && <span className="text-[9px] bg-white text-black px-2 py-0.5 rounded font-bold uppercase tracking-widest">Self</span>}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="font-bold text-white tracking-tighter text-lg">{entry.totalScore}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-white/20 text-xs font-bold">{entry.successfulSubmissions}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default LeaderboardPage;

