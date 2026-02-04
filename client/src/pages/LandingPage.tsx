import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Terminal, Code2, Cpu, Zap, ChevronRight, Hash, Bug, CheckCircle2, Star, Users, TrendingUp, Shield, Award, Clock, Coffee, ChevronLeft, Search, Edit3, Play } from 'lucide-react';

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


const TimelineSection = () => {
    const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false]);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers = itemRefs.current.map((ref, index) => {
            if (!ref) return null;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setVisibleItems((prev) => {
                                const newVisible = [...prev];
                                newVisible[index] = true;
                                return newVisible;
                            });
                        }
                    });
                },
                { threshold: 0.2 }
            );

            observer.observe(ref);
            return observer;
        });

        return () => {
            observers.forEach((observer) => observer?.disconnect());
        };
    }, []);

    return (
        <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-orange-500/50 via-orange-500/30 to-orange-500/50"></div>

            {/* Timeline Item 1 */}
            <div
                ref={(el) => (itemRefs.current[0] = el)}
                className={`relative flex items-center mb-24 transition-all duration-700 ${
                    visibleItems[0] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="w-1/2 pr-12 text-right">
                    <div className="inline-block p-6 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-orange-500/50 transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-white mb-3">Pick a Challenge</h3>
                        <p className="text-slate-400">
                            Start with something easy or jump into the deep end. Each bug has a short description of what's broken and what it should do instead.
                        </p>
                    </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 border-4 border-slate-950 flex items-center justify-center z-10 group hover:scale-110 transition-transform duration-300">
                    <Search className="w-7 h-7 text-white" />
                </div>
                <div className="w-1/2 pl-12"></div>
            </div>

            {/* Timeline Item 2 */}
            <div
                ref={(el) => (itemRefs.current[1] = el)}
                className={`relative flex items-center mb-24 transition-all duration-700 delay-200 ${
                    visibleItems[1] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="w-1/2 pr-12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-4 border-slate-950 flex items-center justify-center z-10 group hover:scale-110 transition-transform duration-300">
                    <Edit3 className="w-7 h-7 text-white" />
                </div>
                <div className="w-1/2 pl-12">
                    <div className="inline-block p-6 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-white mb-3">Read and Fix</h3>
                        <p className="text-slate-400">
                            The code is right there in your browser. Read it, understand what's wrong, and edit it directly. No fancy IDE required.
                        </p>
                    </div>
                </div>
            </div>

            {/* Timeline Item 3 */}
            <div
                ref={(el) => (itemRefs.current[2] = el)}
                className={`relative flex items-center transition-all duration-700 delay-500 ${
                    visibleItems[2] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="w-1/2 pr-12 text-right">
                    <div className="inline-block p-6 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300">
                        <h3 className="text-2xl font-semibold text-white mb-3">See If It Works</h3>
                        <p className="text-slate-400">
                            Hit submit and we'll run the tests. If something's still broken, you'll see exactly which test failed and why.
                        </p>
                    </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 border-4 border-slate-950 flex items-center justify-center z-10 group hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 text-white" />
                </div>
                <div className="w-1/2 pl-12"></div>
            </div>
        </div>
    );
};


const FeatureCard = ({ icon: Icon, title, description, gradient = false, isCenter = false }: { icon: any, title: string, description: string, gradient?: boolean, isCenter?: boolean }) => {
    return (
        <div className={`group relative p-8 rounded-2xl border transition-all duration-500 min-w-[320px] h-[480px] flex flex-col ${
            gradient 
                ? 'bg-gradient-to-br from-orange-500/5 via-slate-900/50 to-blue-500/5 border-orange-500/20 hover:border-orange-500/40' 
                : 'bg-slate-900/50 border-slate-800 hover:border-orange-500/30'
        } ${!isCenter ? 'blur-sm scale-95 opacity-60' : 'blur-0 scale-100 opacity-100'}`}>
            {/* Decorative corner element */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative flex-1 flex flex-col">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500/10 to-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="w-10 h-10 text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-orange-100 transition-colors">{title}</h3>
                <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors flex-1">{description}</p>
            </div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
        </div>
    );
};

const HorizontalScroll = ({ children }: { children: React.ReactNode }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [centerCardIndex, setCenterCardIndex] = useState(0);
    const cardWidth = 320; // card width
    const gap = 80; // gap between cards

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            
            // Account for padding in scroll position
            const paddingLeft = (clientWidth - cardWidth) / 2;
            const adjustedScrollLeft = scrollLeft - paddingLeft;
            
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
            
            // Calculate which card is in center
            const centerViewport = adjustedScrollLeft + clientWidth / 2;
            const cardCenter = cardWidth / 2;
            
            // Find which card's center is closest to viewport center
            const index = Math.round((centerViewport - cardCenter) / (cardWidth + gap));
            setCenterCardIndex(Math.max(0, index));
        }
    };

    useEffect(() => {
        // Center first card on initial load
        if (scrollContainerRef.current) {
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    const paddingLeft = (scrollContainerRef.current.clientWidth - cardWidth) / 2;
                    scrollContainerRef.current.scrollLeft = Math.max(0, paddingLeft);
                    checkScroll();
                }
            }, 0);
        }

        checkScroll();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            window.addEventListener('resize', checkScroll);
            return () => {
                container.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400; // card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scrollContainerRef.current) {
            setIsDragging(true);
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollContainerRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="relative group/scroll">
            {/* Left scroll button */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-200 shadow-xl opacity-0 group-hover/scroll:opacity-100"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
            )}

            {/* Scrollable container */}
            <div
                ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                className={`flex gap-20 overflow-x-auto scrollbar-hide pb-4 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingLeft: `calc((100% - 320px) / 2)`,
                    paddingRight: `calc((100% - 320px) / 2)`
                }}
            >
                {React.Children.map(children, (child, index) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, { 
                            ...child.props, 
                            isCenter: index === centerCardIndex 
                        } as any);
                    }
                    return child;
                })}
            </div>

            {/* Right scroll button */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center text-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-200 shadow-xl opacity-0 group-hover/scroll:opacity-100"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            )}

            {/* Gradient overlays - more subtle to not hide cards */}
            {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none z-10" />
            )}
            {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none z-10" />
            )}
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
                                Debug like your{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                    job depends on it
                                </span>
                                <br />
                                (because it does)
                            </h1>

                            <p className="text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
                                � Plot twist: You're about to release code with a bug that'll make 2 AM you want to quit programming. <br /> <br />
                                Plot twist #2: You could've caught it in BugPulse. For free. While staying sane.
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
                <section id="features" className="py-32 max-w-7xl mx-auto px-6 relative">
                    {/* Background decoration */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-sm text-orange-400 mb-6">
                                <Zap className="w-4 h-4" />
                                <span>Why developers choose us</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                The debugging practice you actually need
                            </h2>
                            <p className="text-xl text-slate-400 mb-4">
                                Real bugs from real codebases. Not practice puzzles.
                            </p>
                            <p className="text-sm text-slate-500">← Drag to explore or use the arrows →</p>
                        </div>

                        {/* Horizontal scrolling features */}
                        <HorizontalScroll>
                            <FeatureCard
                                icon={Bug}
                                title="It's Not Just Broken Code"
                                description="Every bug comes with the full story—error messages, stack traces, what the user was trying to do. You know, like real debugging."
                                gradient={true}
                            />
                            
                            <FeatureCard
                                icon={Clock}
                                title="Your Time, Your Rules"
                                description="Pause mid-debug to grab coffee. Come back three days later. We won't judge. Some bugs need time to marinate in your brain anyway."
                            />
                            
                            <FeatureCard
                                icon={Code2}
                                title="Languages That Pay Bills"
                                description="Python, JavaScript, Java, C++. The ones showing up in job descriptions, not the ones trying to be clever on Twitter."
                            />
                            
                            <FeatureCard
                                icon={Coffee}
                                title="Bugs That Matter"
                                description="The infinite loop that crashed checkout. The null pointer that broke auth. Real problems, not 'reverse a binary tree' nonsense."
                            />
                            
                            <FeatureCard
                                icon={TrendingUp}
                                title="Actually Track What You Learn"
                                description="See which bugs you crush now versus which ones still trip you up. Finally, progress you can measure without lying to yourself."
                            />

                            <FeatureCard
                                icon={Terminal}
                                title="Test Your Fix Instantly"
                                description="Hit submit. Get results in 2 seconds. No 'npm install' hell. No Docker containers that refuse to start. Just results."
                                gradient={true}
                            />
                        </HorizontalScroll>
                    </div>
                </section>

                {/* How It Works - Timeline */}
                <section className="py-32 bg-slate-900/30 border-y border-slate-900">
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-bold text-white mb-4">Here's how it works</h2>
                            <p className="text-slate-400 text-lg">No installation, no setup. Just start debugging.</p>
                        </div>

                        {/* Timeline */}
                        <TimelineSection />
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
