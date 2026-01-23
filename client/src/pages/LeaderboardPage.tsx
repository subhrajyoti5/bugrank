import React, { useEffect, useState } from 'react';
import { leaderboardService } from '@/services/leaderboardService';
import { LeaderboardEntry } from '@bugrank/shared';
import { Trophy, Medal, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number>(0);

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-slate-400" />;
      case 3:
        return <Award className="h-4 w-4 text-orange-600" />;
      default:
        return <span className="text-xs font-semibold text-slate-500">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-5 animate-fade-in">
          <h1 className="text-sm font-semibold text-slate-100 mb-1 uppercase tracking-wide">Leaderboard</h1>
          <p className="text-xs text-slate-400">
            Top debuggers compete for glory
          </p>
        </div>

        {userRank > 0 && userRank > 20 && (
          <div className="bg-slate-900 border border-slate-800 rounded-md p-3 mb-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Your Rank</p>
                <p className="text-xl font-bold text-orange-400 mt-0.5">#{userRank}</p>
              </div>
              <Trophy className="h-8 w-8 text-orange-400 opacity-50" />
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-md overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {entries.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Trophy className="h-12 w-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-200 mb-1">No Rankings Yet</h3>
              <p className="text-xs text-slate-400">Be the first to complete a challenge!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Rank
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      User
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Score
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Solved
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {entries.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={`transition-colors ${
                        entry.userId === user?.id 
                          ? 'bg-slate-800/60 hover:bg-slate-800/80' 
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center justify-center w-6">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              entry.photoURL ||
                              'https://ui-avatars.com/api/?name=' + encodeURIComponent(entry.displayName)
                            }
                            alt={entry.displayName}
                            className="h-7 w-7 rounded-full"
                          />
                          <div>
                            <p className="text-xs font-medium text-slate-200">{entry.displayName}</p>
                            {entry.userId === user?.id && (
                              <span className="text-xs text-orange-400 font-medium">You</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-right">
                        <span className="text-sm font-bold text-orange-400">
                          {entry.totalScore}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-right">
                        <span className="text-xs text-slate-400">{entry.successfulSubmissions}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-slate-500 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p>Leaderboard updates every hour</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
