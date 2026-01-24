import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal, Code2, Cpu, Zap, ChevronRight, Hash, Bug } from 'lucide-react';

const TypewriterCode = () => {
    const [text, setText] = useState('');
    const fullText = `function fixBug(input: string): Result {
  // TODO: Fix the infinite loop
  let i = 0;
  while (i < input.length) {
    if (input[i] === 'x') {
      return process(i);
    }
    // Bug: i is never incremented
    console.log("Stuck...");
  }
  return null;
}`;

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(timer);
            }
        }, 30); // Speed of typing

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="font-mono text-sm text-slate-300 whitespace-pre-wrap">
            {text}
            <span className="animate-pulse inline-block w-2 h-4 bg-primary-400 ml-1 align-middle"></span>
        </div>
    );
};

const TiltCard = ({ icon: Icon, title, description, features }: { icon: any, title: string, description: string, features: string[] }) => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = e.currentTarget;
        const box = card.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const centerX = box.width / 2;
        const centerY = box.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <div
            className="relative p-8 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-primary-500/30 transition-all duration-200 group perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1, 1, 1)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />

            <div className="w-14 h-14 rounded-lg bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-primary-950/30 group-hover:text-primary-400 group-hover:scale-110 transition-all duration-300">
                <Icon className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary-200 transition-colors">{title}</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
                {description}
            </p>

            <ul className="space-y-2">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-500 group-hover:text-slate-300 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500/50" />
                        {feature}
                    </li>
                ))}
            </ul>
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
            <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-400">
                        <Hash className="w-6 h-6" />
                        <span className="text-xl font-semibold tracking-tight text-slate-100">BugRank</span>
                    </div>
                    <div className="flex items-center gap-6">
                        {!user && (
                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                        {user && (
                            <button
                                onClick={() => navigate('/problems')}
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                                Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main className="relative overflow-hidden">
                {/* Hero Section */}
                <section className="pt-24 pb-32 max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-primary-400 mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                Live Environment
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
                                Master the Art of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">
                                    Debugging
                                </span>
                            </h1>

                            <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
                                Analyze broken logic, identify bottlenecks, and patch critical vulnerabilities.
                                Real-world scenarios where you don't just write code—you fix it.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleStartSolving}
                                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-slate-950 transition-all duration-200 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                                >
                                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                        <div className="relative h-full w-8 bg-white/20"></div>
                                    </div>
                                    <span className="flex items-center gap-2">
                                        Start Solving <ChevronRight className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Right Content: Typewriter Code Snippet */}
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-purple-500/20 blur-2xl rounded-lg -z-10" />

                            <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative">
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                                        <Bug className="w-3 h-3" /> buggy_script.ts
                                    </div>
                                </div>
                                <div className="p-6 min-h-[300px] flex items-start bg-slate-950/90 backdrop-blur">
                                    <TypewriterCode />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Abstract Background Visual */}
                    <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] opacity-10 pointer-events-none select-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-transparent blur-[100px] rounded-full" />
                    </div>
                </section>

                {/* Feature Grid with Parallax */}
                <section className="py-32 border-t border-slate-900 bg-slate-950/50 relative overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-white mb-4">Engineering First</h2>
                            <p className="text-slate-400">Built to mirror the complexity of modern software development. No toy problems.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 perspective-1000">
                            <TiltCard
                                icon={Terminal}
                                title="Real-World Debugging"
                                description="Dive into complex, buggy codebases. Identify logic errors, race conditions, and memory leaks in a simulated production environment."
                                features={['Stack trace analysis', 'Memory leak detection', 'Concurrency issues']}
                            />
                            <TiltCard
                                icon={Zap}
                                title="Instant Feedback"
                                description="Run your patches against comprehensive test suites. Get immediate insight into performance regresssions and edge cases."
                                features={['< 50ms execution', 'Detailed failure reports', 'Regression testing']}
                            />
                            <TiltCard
                                icon={Code2}
                                title="Curated Scenarios"
                                description="From simple syntax errors to complex algorithmic flaws, tackle a wide range of bugs designed to sharpen your engineering instincts."
                                features={['System design bugs', 'Algorithmic optimization', 'Security vulnerabilities']}
                            />
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="border-t border-slate-900 py-12 bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} BugRank. Engineered for excellence.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
