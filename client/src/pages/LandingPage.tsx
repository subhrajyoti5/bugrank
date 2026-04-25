import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Hash, ChevronRight, Code2, Zap, Trophy, Shield, Terminal } from 'lucide-react';
import { SparklesCore } from '@/components/ui/sparkles';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleStartSolving = () => {
        if (user) {
            navigate('/problems');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#0b1120] text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0b1120]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                            <Hash className="w-6 h-6 text-indigo-400" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">BugRank</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="btn-primary-premium py-2 text-sm"
                                >
                                    Get Started
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/problems')}
                                className="btn-primary-premium py-2 text-sm"
                            >
                                Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 min-h-screen flex flex-col items-center justify-center overflow-hidden mesh-gradient">
                {/* Background Elements */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-glow" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] animate-glow" style={{ animationDelay: '2s' }} />

                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <SparklesCore
                        id="tsparticles-hero"
                        background="transparent"
                        minSize={0.4}
                        maxSize={1.2}
                        particleDensity={60}
                        className="w-full h-full"
                        particleColor="#6366f1"
                        speed={0.5}
                    />
                </div>

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-indigo-300 mb-8 animate-float">
                        <Zap className="w-4 h-4 text-indigo-400" />
                        <span>The Ultimate Debugging Arena</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight mb-8 leading-[1.05] text-gradient">
                        Master the art of{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-blue-500">
                            debugging
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Don't just write code. Learn to fix it. Practice with real-world bugs, 
                        edge cases, and architectural flaws in a safe environment.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                        <button
                            onClick={handleStartSolving}
                            className="btn-primary-premium h-16 px-10 text-lg group"
                        >
                            <Code2 className="w-6 h-6 mr-2" />
                            Start Debugging
                            <ChevronRight className="w-6 h-6 ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="btn-premium h-16 px-10 text-lg">
                            <Trophy className="w-6 h-6 mr-2 text-indigo-400" />
                            Leaderboard
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-10 border-t border-white/5">
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white mb-1">500+</div>
                            <div className="text-slate-500 text-sm font-medium">Bugs Squashed</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white mb-1">19+</div>
                            <div className="text-slate-500 text-sm font-medium">Challenges</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white mb-1">C++/Java</div>
                            <div className="text-slate-500 text-sm font-medium">Supported</div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold text-white mb-1">100%</div>
                            <div className="text-slate-500 text-sm font-medium">Free Access</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-white mb-4">Built for Developers</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Everything you need to sharpen your investigative skills.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Terminal className="w-8 h-8 text-indigo-400" />,
                                title: "Real Environments",
                                desc: "Work in a full-featured online editor with real-time feedback and execution."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-cyan-400" />,
                                title: "Production Grade",
                                desc: "Challenges based on actual production bugs found in open-source projects."
                            },
                            {
                                icon: <Trophy className="w-8 h-8 text-blue-400" />,
                                title: "Competitive Edge",
                                desc: "Climb the global leaderboard and prove you're the master of the hunt."
                            }
                        ].map((f, i) => (
                            <div key={i} className="card-premium group">
                                <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-indigo-400 mb-10">
                        <Hash className="w-8 h-8" />
                        <span className="text-2xl font-bold text-white">BugRank</span>
                    </div>
                    <a
                        href="https://subhrajyotisahoo.cloud"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-all duration-300"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Designed & Developed by</span>
                            <span className="text-lg font-bold text-indigo-400 group-hover:text-cyan-400 transition-colors">subhrajyotisahoo.cloud</span>
                        </div>
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

