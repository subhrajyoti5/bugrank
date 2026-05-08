import React, { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Target, Trophy, Code2, Zap, Activity } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="h-10 w-10 rounded-full border border-white/10 border-t-white animate-spin"></div>
      </div>
    );
  }

  const successRate = user.totalSubmissions > 0
    ? ((user.successfulSubmissions || 0) / (user.totalSubmissions || 1) * 100).toFixed(0)
    : 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pb-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 grid-bg opacity-10 pointer-events-none" />
      
      {/* Hero Banner */}
      <div className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[50%] h-full bg-white/[0.02] blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 -mt-32">
        {/* Player Card Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-50 group-hover:opacity-100 transition-all duration-700"></div>
            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=000&color=fff&size=200`}
              alt={user.displayName}
              className="w-40 h-40 rounded-full object-cover border border-white/20 relative z-10 shadow-2xl transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-2 right-2 z-20 bg-white text-black p-2 rounded-full border border-black shadow-lg">
              <Trophy className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-center gap-2 text-white/40 mb-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Internal Profile Verified</span>
            </div>
            <h1 className="text-6xl font-bold text-white tracking-tighter mb-3 leading-none">{user.displayName}</h1>
            <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
              <span className="px-4 py-1 bg-white/5 text-white/60 rounded-full border border-white/10">Level {Math.floor(user.totalScore / 100) + 1} Operative</span>
              <span className="text-white/20">•</span>
              <span className="text-white/30">@{user.username || 'unknown_node'}</span>
            </div>
          </div>

          {/* Main Stats - Floating Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <div className="p-6 rounded-2xl bg-[#050505] border border-white/[0.05] flex items-center gap-6 transition-all hover:border-white/20 group min-w-[200px]">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                <Target className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white tracking-tighter">{user.totalScore}</div>
                <div className="text-[10px] text-white/20 uppercase font-bold tracking-widest mt-1">Total XP</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#050505] border border-white/[0.05] flex items-center gap-6 transition-all hover:border-white/20 group min-w-[200px]">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white tracking-tighter">{user.successfulSubmissions || 0}</div>
                <div className="text-[10px] text-white/20 uppercase font-bold tracking-widest mt-1">Missions</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#050505] border border-white/[0.05] flex items-center gap-6 transition-all hover:border-white/20 group min-w-[200px]">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-3xl font-bold text-white tracking-tighter">{successRate}%</div>
                <div className="text-[10px] text-white/20 uppercase font-bold tracking-widest mt-1">Accuracy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Bento Grid */}
        <div className="grid md:grid-cols-12 gap-8 mt-24">
          {/* Left Col - Attributes & Skills (4 cols) */}
          <div className="md:col-span-4 space-y-8">
            <div className="p-8 rounded-3xl bg-[#050505] border border-white/[0.05] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                <Activity className="w-4 h-4 text-white/40" /> Attributes
              </h3>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                    <span>Problem Identification</span>
                    <span className="text-white">85%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[85%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                    <span>Code Optimization</span>
                    <span className="text-white">92%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[92%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-white/30 mb-3 uppercase tracking-widest">
                    <span>Tactical Consistency</span>
                    <span className="text-white">74%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[74%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/[0.05]">
                <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-6">Internal Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['C++', 'Java', 'Python', 'Rust'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white/[0.02] text-white/40 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/[0.05] hover:border-white/20 hover:text-white transition-all cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Col - Activity & Badges (8 cols) */}
          <div className="md:col-span-8 space-y-8">
            {/* Activity Heatmap */}
            <div className="p-8 rounded-3xl bg-[#050505] border border-white/[0.05] relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-1">Operational Pulse</h3>
                  <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Historical deployment frequency</p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-3xl font-bold text-white tracking-tighter">{user.totalSubmissions}</span>
                  <p className="text-[9px] text-white/20 font-bold uppercase tracking-[0.2em]">Deployments</p>
                </div>
              </div>

              <div className="flex gap-1.5 h-32 items-end justify-between opacity-30">
                {heatmapHeights.map((height, i) => (
                  <div
                    key={i}
                    className="w-full bg-white/10 rounded-sm hover:bg-white/60 transition-all duration-300"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Badges Cabinet */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {
                [
                  { name: 'Slayer', icon: '⚔️', desc: '10+ Missions', bg: 'bg-white/[0.01] border-white/[0.05]' },
                  { name: 'Wraith', icon: '👻', desc: 'Ghost Fixer', bg: 'bg-white/[0.01] border-white/[0.05]' },
                  { name: 'Sniper', icon: '🎯', desc: 'Zero Failures', bg: 'bg-white/[0.01] border-white/[0.05]' },
                  { name: 'Veteran', icon: '🎖️', desc: 'Legacy User', bg: 'bg-white/[0.01] border-white/[0.05]' },
                ].map((badge, i) => (
                  <div key={i} className={`rounded-2xl p-6 border ${badge.bg} flex flex-col items-center text-center transition-all hover:border-white/20 cursor-pointer group`}>
                    <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">{badge.icon}</div>
                    <div className="font-bold text-white text-[10px] uppercase tracking-widest mb-1">{badge.name}</div>
                    <div className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">{badge.desc}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

