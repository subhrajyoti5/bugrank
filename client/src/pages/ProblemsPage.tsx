import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '@/services/challengeService';
import { Challenge } from '@bugrank/shared';
import { Search, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

const ProblemsPage: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      const data = await challengeService.getAll();
      setChallenges(data);
    } catch (error) {
      toast.error('Failed to load challenges');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDifficulty = !selectedDifficulty || challenge.difficulty === selectedDifficulty;
    const matchLanguage = !selectedLanguage || challenge.language === selectedLanguage;
    return matchSearch && matchDifficulty && matchLanguage;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-orange-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 sticky top-0 z-10 bg-slate-950/98 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-3">
          <h1 className="text-base font-semibold text-slate-100 mb-3 tracking-tight">Challenges</h1>
          
          {/* Search Bar */}
          <div className="flex items-center bg-slate-900 rounded-md px-3 py-2 border border-slate-800 hover:border-slate-700 transition">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent ml-2 outline-none text-sm text-slate-200 placeholder-slate-600 flex-1"
            />
          </div>
        </div>
      </div>

      {/* Topic Filter Bar */}
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-12 z-10">
        <div className="max-w-7xl mx-auto px-8 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-900 font-medium text-xs whitespace-nowrap hover:bg-white transition">
              All Topics
            </button>
            <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 hover:text-slate-300 whitespace-nowrap transition">
              Algorithms
            </button>
            <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 hover:text-slate-300 whitespace-nowrap transition">
              Data Structures
            </button>
            <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 hover:text-slate-300 whitespace-nowrap transition">
              Memory
            </button>
            <button className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-400 text-xs hover:bg-slate-700 hover:text-slate-300 whitespace-nowrap transition">
              Concurrency
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex gap-6">
          {/* Problems List */}
          <div className="flex-1">
            {filteredChallenges.length === 0 ? (
              <div className="bg-slate-900 rounded-md p-8 text-center border border-slate-800">
                <h3 className="text-sm font-medium text-slate-400 mb-1">No challenges found</h3>
                <p className="text-xs text-slate-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="border border-slate-800 rounded-md overflow-hidden">
                {/* Table Header */}
                <div className="bg-slate-900 border-b border-slate-800">
                  <div className="grid grid-cols-12 gap-4 px-5 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-5">Problem</div>
                    <div className="col-span-2">Difficulty</div>
                    <div className="col-span-2">Language</div>
                    <div className="col-span-2">Points</div>
                  </div>
                </div>

                {/* Table Rows */}
                {filteredChallenges.map((challenge, index) => (
                  <Link
                    key={challenge.id}
                    to={`/editor/${challenge.id}`}
                    className="block border-b border-slate-800 hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 px-5 py-3 items-center text-sm">
                      <div className="col-span-1">
                        <div className="w-4 h-4 rounded border border-slate-700 hover:border-slate-600 transition"></div>
                      </div>
                      <div className="col-span-5">
                        <p className="text-slate-200 text-sm font-medium hover:text-orange-400 transition">
                          {index + 1}. {challenge.title}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className={`text-xs font-medium capitalize ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 text-xs uppercase tracking-tight">{challenge.language}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-300 text-xs font-medium">{challenge.baseScore}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Filter Stats */}
          <div className="w-60">
            <div className="bg-slate-900 rounded-md border border-slate-800 p-3 sticky top-32">
              <h3 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">Filters</h3>
              
              {/* Difficulty Filter */}
              <div className="mb-4">
                <label className="text-xs font-medium text-slate-400 uppercase mb-2 block tracking-tight">Difficulty</label>
                <div className="space-y-1.5">
                  {['easy', 'medium', 'hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? '' : diff)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition ${
                        selectedDifficulty === diff
                          ? 'bg-orange-500/90 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Filter */}
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase mb-2 block tracking-tight">Language</label>
                <div className="space-y-1.5">
                  {['cpp', 'java'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(selectedLanguage === lang ? '' : lang)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition ${
                        selectedLanguage === lang
                          ? 'bg-orange-500/90 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 space-y-1.5">
                  <p>Total: <span className="text-slate-100 font-medium">{filteredChallenges.length}</span></p>
                  <p>Solved: <span className="text-green-400 font-medium">0</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
