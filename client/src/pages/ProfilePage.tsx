import React, { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Target, Trophy, Code2 } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser().catch(error => {
      console.error('Failed to refresh user data:', error);
    });
  }, [refreshUser]);

  // Generate stable heatmap heights using useMemo
  const heatmapHeights = useMemo(() => {
    return Array.from({ length: 40 }, () => Math.random() * 100);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  const successRate = user.totalSubmissions > 0
    ? ((user.successfulSubmissions || 0) / (user.totalSubmissions || 1) * 100).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-violet-500/30 pb-20">

      {/* Hero Banner with organic mesh gradient */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent opacity-70"></div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 -mt-32">

        {/* Player Card Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-br from-violet-600 to-orange-500 rounded-full blur opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"></div>
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random&size=150`}
              alt={user.displayName}
              className="w-40 h-40 rounded-full object-cover border-4 border-[#0a0a0a] relative z-10 shadow-2xl transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105"
            />
            <div className="absolute bottom-2 right-2 z-20 bg-[#0a0a0a] text-amber-400 p-1.5 rounded-full border border-amber-500/30 shadow-lg">
              <Trophy className="w-5 h-5" fill="currentColor" />
            </div>
          </div>

          <div className="mt-6 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
            <h1 className="text-5xl font-black text-white tracking-tight mb-2 drop-shadow-xl">{user.displayName}</h1>
            <div className="flex items-center justify-center gap-3 text-sm font-medium">
              <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]">Level {Math.floor(user.totalScore / 100) + 1} Hacker</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">@{user.username || 'code_wizard'}</span>
            </div>
          </div>

          {/* Main Stats - Floating Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
            <div className="bg-[#111] hover:bg-[#161616] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 hover:border-violet-500/30 group">
              <div className="bg-violet-500/20 p-2 rounded-lg text-violet-400 group-hover:text-violet-300">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white leading-none">{user.totalScore}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reputation</div>
              </div>
            </div>

            <div className="bg-[#111] hover:bg-[#161616] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 hover:border-emerald-500/30 group">
              <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400 group-hover:text-emerald-300">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white leading-none">{user.successfulSubmissions || 0}</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Solutions</div>
              </div>
            </div>

            <div className="bg-[#111] hover:bg-[#161616] border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 hover:border-orange-500/30 group">
              <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400 group-hover:text-orange-300">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white leading-none">{successRate}%</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Precision</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Bento Grid */}
        <div className="grid md:grid-cols-12 gap-6 mt-16 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">

          {/* Left Col - Attributes & Skills (4 cols) */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/20 transition-all"></div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span>⚡</span> Attributes
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">
                    <span>Problem Solving</span>
                    <span className="text-violet-400">85/100</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-600 to-purple-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">
                    <span>Debugging</span>
                    <span className="text-emerald-400">92/100</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 w-[92%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">
                    <span>Consistency</span>
                    <span className="text-orange-400">74/100</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-600 to-amber-400 w-[74%] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tech Arsenal</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python', 'Rust'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-lg border border-white/5 hover:border-violet-500/50 hover:bg-violet-900/20 transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col - Activity & Badges (8 cols) */}
          <div className="md:col-span-8 space-y-6">

            {/* Activity Heatmap Area - Styled as QUEST LOG */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Quest Log</h3>
                  <p className="text-sm text-slate-500">Contribution history over the last year</p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-2xl font-bold text-emerald-400">{user.totalSubmissions}</span>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Actions</p>
                </div>
              </div>

              {/* Faux Heatmap Visual for now - Replace with actual logic if needed */}
              <div className="flex gap-1 h-32 items-end justify-between opacity-50 mask-image-gradient">
                {heatmapHeights.map((height, i) => (
                  <div
                    key={i}
                    className="w-full bg-violet-500/20 rounded-t-sm hover:bg-violet-500/60 transition-colors"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Badges Cabinet */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Bug Slayer', icon: '⚔️', desc: 'Solved 10+ bugs', bg: 'bg-red-500/10 border-red-500/20' },
                { name: 'Early Bird', icon: '🌅', desc: 'Active at 5AM', bg: 'bg-amber-500/10 border-amber-500/20' },
                { name: 'Sniper', icon: '🎯', desc: '100% Accuracy', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                { name: 'Veteran', icon: '🎖️', desc: 'Year Member', bg: 'bg-purple-500/10 border-purple-500/20' },
              ].map((badge, i) => (
                <div key={i} className={`rounded-2xl p-4 border ${badge.bg} flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-lg cursor-pointer group`}>
                  <div className="text-3xl mb-2 group-hover:animate-bounce">{badge.icon}</div>
                  <div className="font-bold text-white text-sm">{badge.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{badge.desc}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
