import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Hash, ChevronRight, Code2, Zap } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30 selection:text-primary-200">
            {/* Navbar */}
            <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50 bg-slate-950/95">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-400">
                        <Hash className="w-6 h-6" />
                        <span className="text-xl font-semibold tracking-tight text-slate-100">BugRank</span>
                    </div>
                    <div className="flex items-center gap-6">
                        {!user && (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 rounded-lg bg-white text-slate-950 text-sm font-medium hover:bg-slate-200 transition-colors"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                        {user && (
                            <button
                                onClick={() => navigate('/problems')}
                                className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                            >
                                Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Sparkles Background */}
                <div className="absolute inset-0 w-full h-full">
                    <SparklesCore
                        id="tsparticles-hero"
                        background="transparent"
                        minSize={0.6}
                        maxSize={1.4}
                        particleDensity={100}
                        className="w-full h-full"
                        particleColor="#ffffff"
                        speed={1}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 mb-8">
                        <Zap className="w-4 h-4" />
                        <span>Debug like a pro</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                        Master debugging with{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                            real bugs
                        </span>
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Practice debugging with actual code problems from real applications.
                        Build your skills with challenges that matter.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button
                            onClick={handleStartSolving}
                            className="group inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 font-semibold text-slate-950 transition-all duration-200 hover:bg-slate-200 hover:shadow-xl hover:shadow-white/10"
                        >
                            <span className="flex items-center gap-2">
                                <Code2 className="w-5 h-5" />
                                Start Debugging
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>

                    {/* Simple stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">19</div>
                            <div className="text-slate-400 text-sm">Challenges</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">C++</div>
                            <div className="text-slate-400 text-sm">Languages</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">Free</div>
                            <div className="text-slate-400 text-sm">Forever</div>
                        </div>
                    </div>
                </div>

                {/* Radial Gradient to prevent sharp edges */}
                <div className="absolute inset-0 w-full h-full bg-slate-950 [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </section>
        </div>
    );
};

export default LandingPage;
