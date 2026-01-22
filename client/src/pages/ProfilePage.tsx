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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
        <div className="card mb-8 animate-fade-in">
          <div className="flex items-center space-x-6">
            <img
              src={displayUser.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayUser.displayName)}
              alt={displayUser.displayName}
              className="h-24 w-24 rounded-full"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{displayUser.displayName}</h1>
              <p className="text-gray-600 mb-4">{displayUser.email}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold text-gray-900">{displayUser.totalScore} points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">{displayUser.successfulSubmissions} solved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-600">{successRate}% success rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-primary-600 mb-2">{displayUser.totalScore}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="text-3xl font-bold text-green-600 mb-2">{displayUser.successfulSubmissions}</div>
            <div className="text-sm text-gray-600">Problems Solved</div>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-blue-600 mb-2">{displayUser.totalSubmissions}</div>
            <div className="text-sm text-gray-600">Total Attempts</div>
          </div>
          <div className="card text-center animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="text-3xl font-bold text-purple-600 mb-2">{successRate}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Code2 className="h-6 w-6 text-primary-600" />
            <span>Recent Submissions</span>
          </h2>

          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <Code2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No submissions yet. Start debugging!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.slice(0, 10).map((submission: any) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{submission.challengeTitle || 'Challenge'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString()} at{' '}
                      {new Date(submission.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {submission.isCorrect ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Correct
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        ✗ Incorrect
                      </span>
                    )}
                    {submission.score && (
                      <p className="text-sm font-semibold text-gray-900 mt-1">{submission.score} pts</p>
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
