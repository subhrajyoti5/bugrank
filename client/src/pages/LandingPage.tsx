import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal, Code2, Cpu, Zap, ChevronRight, Hash, Bug, CheckCircle2, Star, Users, TrendingUp, Shield, Award, Clock, Coffee } from 'lucide-react';

const FloatingCodePreview = () => {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Floating Card 1 - Production Bug */}
            <div className="absolute top-0 right-12 w-[320px] bg-slate-900/95 backdrop-blur-md border border-red-500/40 rounded-xl p-5 shadow-2xl animate-float z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-400 font-mono">Production Bug 🔥</span>
                </div>
                <pre className="text-[11px] leading-relaxed text-slate-300 font-mono mb-3">
{`function checkout(cart) {
  let total = 0;
  for (let i = 0; i < cart.length) {
    total += cart[i].price;
  }
  return total;
}`}
                </pre>
                <div className="text-xs text-red-400 font-medium">⚠️ Infinite loop detected</div>
            </div>

            {/* Floating Card 2 - Fixed */}
            <div className="absolute bottom-0 left-12 w-[320px] bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 rounded-xl p-5 shadow-2xl animate-float-delayed z-10">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-slate-400 font-mono">Fixed ✓</span>
                </div>
                <pre className="text-[11px] leading-relaxed text-slate-300 font-mono mb-3">
{`function checkout(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price;
  }
  return total;
}`}
                </pre>
                <div className="text-xs text-emerald-400 font-medium">✓ All tests passing</div>
            </div>

            {/* Center Glow Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 bg-gradient-to-br from-orange-500/15 via-blue-500/10 to-transparent blur-3xl rounded-full"></div>
            </div>
        </div>
    );
};


const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => {
    return (
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/10 to-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
};

const TestimonialCard = ({ name, role, content, time }: { name: string, role: string, content: string, time: string }) => {
    return (
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
            </div>
            <p className="text-slate-300 mb-6 leading-relaxed text-sm">{content}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 font-semibold text-sm border border-slate-700">
                        {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="text-white font-medium text-sm">{name}</div>
                        <div className="text-slate-500 text-xs">{role}</div>
                    </div>
                </div>
                <div className="text-xs text-slate-500">{time}</div>
            </div>
        </div>
    );
};

const StatsCard = ({ value, label, subtext }: { value: string, label: string, subtext?: string }) => {
    return (
        <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-slate-400 text-sm">{label}</div>
            {subtext && <div className="text-slate-600 text-xs mt-1">{subtext}</div>}
        </div>
    );
};


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

            <main className="relative overflow-hidden">
                {/* Hero Section */}
                <section className="pt-20 pb-32 max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
                                Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                    broken code
                                </span>{' '}
                                <br />into working software
                            </h1>

                            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                                It's 2 AM. Your app just crashed. Users are complaining. We help you get better at finding and fixing bugs before they reach production.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button
                                    onClick={handleStartSolving}
                                    className="group inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 font-semibold text-slate-950 transition-all duration-200 hover:bg-slate-200 hover:shadow-xl hover:shadow-white/10"
                                >
                                    <span className="flex items-center gap-2">
                                        Start Fixing
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                                <button
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="inline-flex h-14 items-center justify-center rounded-lg border border-slate-700 px-8 font-medium text-slate-300 transition-all duration-200 hover:border-slate-600 hover:bg-slate-900/50"
                                >
                                    Learn More
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                                <StatsCard value="3,247" label="Bugs Fixed" subtext="this month" />
                                <StatsCard value="892" label="Active Users" subtext="and growing" />
                                <StatsCard value="12 min" label="Avg. Fix Time" subtext="per challenge" />
                            </div>
                        </div>

                        {/* Right Content: Floating Code Preview */}
                        <div className="relative flex items-center justify-center">
                            <FloatingCodePreview />
                        </div>
                    </div>

                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] opacity-20 pointer-events-none select-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-blue-500 to-transparent blur-[120px] rounded-full" />
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-16 border-y border-slate-900 bg-slate-900/30">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center text-slate-500 text-sm mb-8">Joined by developers preparing for interviews at</p>
                        <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
                            <div className="text-xl font-semibold text-slate-600">Startups</div>
                            <div className="text-xl font-semibold text-slate-600">Tech Companies</div>
                            <div className="text-xl font-semibold text-slate-600">Universities</div>
                            <div className="text-xl font-semibold text-slate-600">Bootcamps</div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-32 max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Stop staring at broken code for hours
                        </h2>
                        <p className="text-xl text-slate-400">
                            We've all been there. A bug that seems impossible to fix. Learn to debug systematically, not desperately.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Bug}
                            title="Real Bugs, Real Context"
                            description="Each challenge comes from actual production issues. You'll see the stack trace, error logs, and user reports—just like the real thing."
                        />
                        <FeatureCard
                            icon={Clock}
                            title="Learn at Your Pace"
                            description="No time pressure. Take 5 minutes or 5 hours. Read the code, understand the logic, then fix it when you're ready."
                        />
                        <FeatureCard
                            icon={Code2}
                            title="Common Languages Only"
                            description="Python, JavaScript, Java, and C++. We focus on what you'll actually use at work, not obscure syntax tricks."
                        />
                        <FeatureCard
                            icon={Coffee}
                            title="Practical Scenarios"
                            description="Infinite loops, null pointers, race conditions, memory leaks. The bugs that actually break production systems."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="See Your Progress"
                            description="Track which types of bugs you're getting better at. See patterns in your debugging approach over time."
                        />
                        <FeatureCard
                            icon={Terminal}
                            title="Instant Test Results"
                            description="Submit your fix and see if it works in seconds. No waiting, no setup, no complicated build processes."
                        />
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-32 bg-slate-900/30 border-y border-slate-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">Here's how it works</h2>
                            <p className="text-slate-400 text-lg">No installation, no setup. Just start debugging.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="relative p-8 rounded-xl bg-slate-950/50 border border-slate-800">
                                <div className="w-12 h-12 rounded-full bg-orange-500/10 border-2 border-orange-500/50 flex items-center justify-center text-orange-400 font-bold text-xl mb-6">
                                    1
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">Pick a Challenge</h3>
                                <p className="text-slate-400">
                                    Start with something easy or jump into the deep end. Each bug has a short description of what's broken and what it should do instead.
                                </p>
                            </div>

                            <div className="relative p-8 rounded-xl bg-slate-950/50 border border-slate-800">
                                <div className="w-12 h-12 rounded-full bg-orange-500/10 border-2 border-orange-500/50 flex items-center justify-center text-orange-400 font-bold text-xl mb-6">
                                    2
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">Read and Fix</h3>
                                <p className="text-slate-400">
                                    The code is right there in your browser. Read it, understand what's wrong, and edit it directly. No fancy IDE required.
                                </p>
                            </div>

                            <div className="relative p-8 rounded-xl bg-slate-950/50 border border-slate-800">
                                <div className="w-12 h-12 rounded-full bg-orange-500/10 border-2 border-orange-500/50 flex items-center justify-center text-orange-400 font-bold text-xl mb-6">
                                    3
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">See If It Works</h3>
                                <p className="text-slate-400">
                                    Hit submit and we'll run the tests. If something's still broken, you'll see exactly which test failed and why.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Role-based Section */}
                <section className="py-32 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">Who this is for</h2>
                        <p className="text-slate-400 text-lg">Honestly? Anyone who writes code.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-900/80 border border-slate-800">
                            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Learning to Code</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                Still in school or just starting out? Good. You'll learn to spot common mistakes before they become habits. Way better than copying solutions from Stack Overflow without understanding them.
                            </p>
                            <ul className="space-y-3">
                                {['Understand why code breaks (not just how)', 'Get comfortable reading other people\'s code', 'Actually learn from your mistakes'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-900/80 border border-slate-800">
                            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                                <Terminal className="w-7 h-7 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Already Working</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                You've shipped code before. You know the feeling when production breaks at 3 PM on Friday. Practice debugging when the stakes are low, so you're faster when they're high.
                            </p>
                            <ul className="space-y-3">
                                {['Debug faster under pressure', 'See bugs you\'ve probably written yourself', 'Prep for those "fix a bug" interview questions'].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-32 bg-slate-900/30 border-y border-slate-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-white mb-4">What people are saying</h2>
                            <p className="text-slate-400 text-lg">
                                Real feedback from developers using BugRank
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <TestimonialCard
                                name="Alex Rivera"
                                role="Software Engineer"
                                time="2 weeks ago"
                                content="I spent 6 hours debugging a memory leak last week. Did one of the challenges here that was basically the same problem. Wish I'd found this sooner. Would've saved me so much time."
                            />
                            <TestimonialCard
                                name="Jordan Kim"
                                role="CS Student"
                                time="1 month ago"
                                content="My algorithms prof doesn't teach debugging at all. Just theory. This actually helped me understand what happens when code runs, not just what it's supposed to do. Game changer for my assignments."
                            />
                            <TestimonialCard
                                name="Sam Peters"
                                role="Junior Developer"
                                time="3 weeks ago"
                                content="Got asked to debug code during my last interview. I'd practiced similar bugs here so I didn't panic. Actually walked through it step by step. Pretty sure that's why I got the offer."
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-32 max-w-5xl mx-auto px-6 text-center">
                    <div className="relative p-12 rounded-2xl bg-gradient-to-br from-orange-500/5 to-blue-500/5 border border-slate-800">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Start debugging better
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                            It's free to start. Pick a bug, fix it, see if it works. That's it. No credit card, no trial period that expires when you're halfway through.
                        </p>
                        <button
                            onClick={handleStartSolving}
                            className="inline-flex h-14 items-center justify-center rounded-lg bg-orange-500 px-10 font-semibold text-white transition-all duration-200 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20"
                        >
                            Try Your First Challenge
                        </button>

                        {/* Background decoration */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-16 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 text-primary-400 mb-4">
                                <Hash className="w-6 h-6" />
                                <span className="text-xl font-semibold text-slate-100">BugRank</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                The platform for mastering debugging through real-world challenges.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><a href="#features" className="text-slate-500 hover:text-white text-sm transition-colors">Features</a></li>
                                <li><a href="/problems" className="text-slate-500 hover:text-white text-sm transition-colors">Challenges</a></li>
                                <li><a href="/leaderboard" className="text-slate-500 hover:text-white text-sm transition-colors">Leaderboard</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">About</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Blog</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Privacy</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Terms</a></li>
                                <li><a href="#" className="text-slate-500 hover:text-white text-sm transition-colors">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} BugRank. Engineered for excellence.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
