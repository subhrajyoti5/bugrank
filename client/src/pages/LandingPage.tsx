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
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden font-sans">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center">

                {/* Background Grid */}
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="absolute inset-0 radial-glow" />

                {/* Animated Light Beams */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

                <div className="relative z-10 text-center max-w-5xl mx-auto px-6 animate-slide-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-10">
                        <Terminal className="w-3.5 h-3.5 text-white/80" />
                        <span>The Digital Debugging Frontier</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-10 leading-[0.95] text-gradient">
                        Practice the art <br />
                        <span className="text-white/40">of debugging.</span>
                    </h1>

                    <p className="text-lg text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                        BugRank is the elite arena for hunters. Solve production-grade bugs, 
                        master architectural edge cases, and elevate your engineering intuition.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
                        <button
                            onClick={handleStartSolving}
                            className="btn-primary-premium h-14 px-10 text-xs uppercase tracking-[0.2em] group"
                        >
                            Start Mission
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="btn-premium h-14 px-10 text-xs uppercase tracking-[0.2em]">
                            View Dossier
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto py-12 border-t border-white/[0.05]">
                        {[
                            { label: 'Bugs Resolved', value: '500+' },
                            { label: 'Active Missions', value: '19+' },
                            { label: 'Environments', value: 'Polyglot' },
                            { label: 'Access', value: 'Open' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="text-2xl font-bold text-white mb-1 tracking-tighter">{stat.value}</div>
                                <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-40 relative border-t border-white/[0.05] bg-[#020202]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Engineered for Excellence</h2>
                        <p className="text-white/40 max-w-md font-medium">Tools and challenges designed to push your technical boundaries.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Terminal className="w-5 h-5" />,
                                title: "Isolated Runtimes",
                                desc: "High-performance sandboxed environments with zero latency feedback loops."
                            },
                            {
                                icon: <Shield className="w-5 h-5" />,
                                title: "Architectural Flaws",
                                desc: "Go beyond syntax. Debug concurrency issues, race conditions, and memory leaks."
                            },
                            {
                                icon: <Trophy className="w-5 h-5" />,
                                title: "Global Ranking",
                                desc: "Competitive scoring system that rewards efficiency, safety, and performance."
                            }
                        ].map((f, i) => (
                            <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all duration-300 group">
                                <div className="p-3 bg-white/5 rounded-xl w-fit mb-8 border border-white/5 group-hover:border-white/10 transition-colors">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.05] py-24 bg-black relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 mb-12">
                        <Hash className="w-6 h-6 text-white" />
                        <span className="text-xl font-bold tracking-tighter text-white">BugRank</span>
                    </div>
                    
                    <div className="space-y-6">
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">Designed & Developed by</p>
                        <a
                            href="https://subhrajyotisahoo.cloud"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl font-bold text-white/60 hover:text-white transition-all duration-300 tracking-tighter"
                        >
                            subhrajyotisahoo.cloud
                        </a>
                    </div>
                    
                    <div className="mt-20 pt-12 border-t border-white/[0.05] w-full flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">© 2024 BugRank Terminal. All rights reserved.</p>
                        <div className="flex gap-8">
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest cursor-pointer hover:text-white/40">Privacy</span>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest cursor-pointer hover:text-white/40">Terms</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};


export default LandingPage;

