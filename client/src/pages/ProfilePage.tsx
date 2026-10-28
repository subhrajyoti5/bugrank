import React, { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser().catch((error) => {
      console.error('Failed to refresh user data:', error);
    });
  }, [refreshUser]);

  // Stable activity heights
  const activityHeights = useMemo(() => {
    return Array.from({ length: 48 }, () => Math.floor(Math.random() * 80) + 20);
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-canvas">
        <div className="w-8 h-8 rounded-md border-2 border-border-line border-t-text-primary animate-spin mb-4" />
        <span className="font-mono text-xs text-text-muted tracking-widest uppercase">
          Loading Profile...
        </span>
      </div>
    );
  }

  const successRate = user.totalSubmissions > 0
    ? Math.round(((user.successfulSubmissions || 0) / user.totalSubmissions) * 100)
    : 0;

  const level = Math.floor((user.totalScore || 0) / 100) + 1;

  return (
    <div className="min-h-screen bg-canvas text-text-primary selection:bg-charcoal selection:text-offwhite dark:selection:bg-offwhite dark:selection:text-charcoal pb-20">
      
      {/* Banner */}
      <div className="h-36 w-full bg-surface-subtle border-b border-border-line relative overflow-hidden">
        <div className="absolute inset-0 grid-subtle-pattern opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10 -mt-16">
        
        {/* Profile Header - Centered Layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border-line text-center md:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar Frame - Rounded rectangle */}
            <div className="w-28 h-28 rounded-xl border-2 border-border-line bg-surface-card overflow-hidden shadow-sm flex items-center justify-center">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-serif text-3xl font-normal text-text-primary">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name and Level */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md border border-border-line bg-surface-subtle mb-2">
                <span className="eyebrow-text text-[10px]">ENGINEER PROFILE / TIER {level}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-text-primary font-normal tracking-tight">
                {user.displayName || 'Anonymous Engineer'}
              </h1>
              <p className="text-xs font-mono text-text-muted mt-0.5">
                @{user.username || user.email?.split('@')[0] || 'engineer'}
              </p>
            </div>
          </div>

          <Link
            to="/problems"
            className="btn-primary text-xs py-2.5 px-6 rounded-lg"
          >
            Open Missions
          </Link>
        </div>

        {/* 3 Main Stat Cards - Centered text */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 text-center">
          <div className="card-frame p-6 bg-surface-card text-center">
            <span className="font-serif text-3xl font-normal text-text-primary leading-none block">
              {user.totalScore || 0}
            </span>
            <span className="eyebrow-text block mt-1.5 text-[10px] text-center">Total Score</span>
          </div>

          <div className="card-frame p-6 bg-surface-card text-center">
            <span className="font-serif text-3xl font-normal text-text-primary leading-none block">
              {user.successfulSubmissions || 0}
            </span>
            <span className="eyebrow-text block mt-1.5 text-[10px] text-center">Missions Solved</span>
          </div>

          <div className="card-frame p-6 bg-surface-card text-center">
            <span className="font-serif text-3xl font-normal text-text-primary leading-none block">
              {successRate}%
            </span>
            <span className="eyebrow-text block mt-1.5 text-[10px] text-center">Patch Accuracy</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-12 gap-6">
          
          {/* Left: Competencies (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="card-frame p-6 bg-surface-card">
              <div className="mb-5 pb-3 border-b border-border-line">
                <span className="eyebrow-text text-[10px]">ENGINEERING COMPETENCIES</span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-medium text-text-secondary mb-1.5">
                    <span>Root Cause Isolation</span>
                    <span className="font-mono text-text-primary font-bold">88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-subtle rounded-md overflow-hidden border border-border-line">
                    <div className="h-full bg-text-primary w-[88%] rounded-md" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-text-secondary mb-1.5">
                    <span>Diff Minimization</span>
                    <span className="font-mono text-text-primary font-bold">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-subtle rounded-md overflow-hidden border border-border-line">
                    <div className="h-full bg-text-primary w-[92%] rounded-md" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-text-secondary mb-1.5">
                    <span>Concurrency Safety</span>
                    <span className="font-mono text-text-primary font-bold">79%</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-subtle rounded-md overflow-hidden border border-border-line">
                    <div className="h-full bg-text-primary w-[79%] rounded-md" />
                  </div>
                </div>
              </div>

              {/* Supported Languages */}
              <div className="pt-5 mt-5 border-t border-border-line">
                <span className="eyebrow-text block mb-2.5 text-[10px]">ENVIRONMENTS</span>
                <div className="flex flex-wrap gap-1.5">
                  {['C++20', 'Java 21', 'Rust', 'Go'].map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 bg-surface-subtle text-text-secondary text-[11px] font-mono rounded-md border border-border-line"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Submission Activity & Milestones (8 cols) */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Activity Pulse */}
            <div className="card-frame p-6 bg-surface-card">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-border-line">
                <div>
                  <h2 className="text-xs font-semibold text-text-primary uppercase tracking-wider">Execution History</h2>
                  <p className="text-xs text-text-muted">Trace verification activity over recent cycles</p>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl text-text-primary">
                    {user.totalSubmissions}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono block">RUNS</span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="flex gap-1 h-24 items-end justify-between pt-2">
                {activityHeights.map((h, i) => (
                  <div
                    key={i}
                    title={`Session ${i + 1}: ${h}%`}
                    className="w-full bg-surface-subtle hover:bg-text-primary transition-colors duration-150 rounded-t-sm"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Milestones Card */}
            <div className="card-frame p-6 bg-surface-card">
              <span className="eyebrow-text block mb-3 text-[10px]">VERIFIED MILESTONES</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'Clean Patches', desc: '10+ Zero-Warning Fixes' },
                  { name: 'Race Resolver', desc: 'Lock-Free Fixes' },
                  { name: 'Zero Allocation', desc: 'No Memory Leaks' },
                  { name: 'Top Tier', desc: 'Top 10% Leaderboard' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg border border-border-line bg-surface-subtle/50 text-left"
                  >
                    <span className="font-mono text-xs text-text-muted block mb-1">0{i + 1}</span>
                    <div className="text-xs font-semibold text-text-primary">{item.name}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
