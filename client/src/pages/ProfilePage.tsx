import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submissionService } from '@/services/submissionService';
import apiClient from '@/services/api';
import { User, Code2, Trophy, Target, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      // Fetch fresh profile data from backend
      const profileResponse = await apiClient.get(`/api/submissions/profile/${user.id}`);
      setProfile(profileResponse.data.data);

      // Fetch submissions
      const submissionsResponse = await submissionService.getUserSubmissions(user.id);
      setSubmissions(submissionsResponse);
    } catch (error) {
      toast.error('Failed to load profile data');
      console.error(error);
      // Use user data from context as fallback
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  if (!user) return null;

  // Use fetched profile data, fallback to user from context
  const displayUser = profile || user;
  const successRate = displayUser.totalSubmissions > 0
    ? Math.round((displayUser.successfulSubmissions / displayUser.totalSubmissions) * 100)
    : 0;

  return (
    <div className="page-container">
      <div className="content-wrapper max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-md p-3 mb-5 animate-fade-in">
          <div className="flex items-center space-x-3">
            <img
              src={displayUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayUser.displayName)}
              alt={displayUser.displayName}
              className="h-16 w-16 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-slate-100">{displayUser.displayName}</h1>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{displayUser.email}</p>
              <div className="flex items-center space-x-3 text-xs mt-2">
                <div className="flex items-center space-x-1">
                  <Trophy className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                  <span className="font-medium text-slate-200">{displayUser.totalScore}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-400">{displayUser.successfulSubmissions}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-400">{successRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-2 mb-5">
          <div className="bg-slate-900 border border-slate-800 rounded-md p-2.5 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-xl font-bold text-orange-400 mb-0.5">{displayUser.totalScore}</div>
            <div className="text-xs text-slate-400">Points</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-md p-2.5 text-center animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="text-xl font-bold text-emerald-400 mb-0.5">{displayUser.successfulSubmissions}</div>
            <div className="text-xs text-slate-400">Solved</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-md p-2.5 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-xl font-bold text-blue-400 mb-0.5">{displayUser.totalSubmissions}</div>
            <div className="text-xs text-slate-400">Attempts</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-md p-2.5 text-center animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="text-xl font-bold text-purple-400 mb-0.5">{successRate}%</div>
            <div className="text-xs text-slate-400">Success</div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-md p-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xs font-semibold text-slate-200 mb-3 flex items-center space-x-1.5 uppercase tracking-wide">
            <Code2 className="h-3.5 w-3.5 text-orange-400" />
            <span>Submissions</span>
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-6">
              <Code2 className="h-10 w-10 text-slate-700 mx-auto mb-2" />
              <p className="text-slate-400 text-xs">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {submissions.slice(0, 10).map((submission: any) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-2.5 rounded text-xs border border-slate-800 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate">{submission.challengeTitle || 'Challenge'}</p>
                    <p className="text-slate-500 mt-0.5 text-xs">
                      {new Date(submission.createdAt).toLocaleDateString()} {new Date(submission.createdAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    {submission.isCorrect ? (
                      <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-block px-1.5 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-400">
                        ✗
                      </span>
                    )}
                    {submission.score && (
                      <p className="text-xs font-semibold text-orange-400 mt-1">{submission.score}pts</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
