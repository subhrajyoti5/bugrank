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
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-lg font-semibold text-gray-600">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">
            Top debuggers compete for glory. Rankings update hourly.
          </p>
        </div>

        {userRank > 0 && userRank > 20 && (
          <div className="card bg-primary-50 border-primary-200 mb-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-900 font-medium">Your Rank</p>
                <p className="text-2xl font-bold text-primary-600">#{userRank}</p>
              </div>
              <Trophy className="h-12 w-12 text-primary-400" />
            </div>
          </div>
        )}

        <div className="card p-0 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {entries.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Rankings Yet</h3>
              <p className="text-gray-600">Be the first to complete a challenge!</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solved
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.map((entry, index) => (
                    <tr
                      key={entry.userId}
                      className={`hover:bg-gray-50 transition-colors ${
                        entry.userId === user?.id ? 'bg-primary-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center w-10">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              entry.photoURL ||
                              'https://ui-avatars.com/api/?name=' + encodeURIComponent(entry.displayName)
                            }
                            alt={entry.displayName}
                            className="h-10 w-10 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{entry.displayName}</p>
                            {entry.userId === user?.id && (
                              <span className="text-xs text-primary-600 font-medium">You</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          {entry.totalScore}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-gray-600">{entry.successfulSubmissions}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <p>Leaderboard updates every hour via Cloud Functions</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
