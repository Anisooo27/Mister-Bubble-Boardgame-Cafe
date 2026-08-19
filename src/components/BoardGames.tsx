import React, { useState } from 'react';
import { BOARD_GAMES, BOARD_GAME_CATEGORIES } from '../data/gamesData';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { PlayerBoard } from './PlayerBoard';
import { GameFinder } from './GameFinder';
import { Leaderboard } from './Leaderboard';
import { useLanguage } from '../context/LanguageContext';
import { Dices, Users, Clock, Flame, Sparkles, BookOpen, Trophy, Compass } from 'lucide-react';

export const BoardGames: React.FC = () => {
  const { t } = useLanguage();
  const [selectedGenre, setSelectedGenre] = useState<string>('All Games');
  const [activeSubTab, setActiveSubTab] = useState<'library' | 'quiz' | 'leaderboard' | 'lfp'>('library');

  const filteredGames = BOARD_GAMES.filter((game) => {
    if (selectedGenre === 'All Games') return true;
    return game.category === selectedGenre;
  });

  const genreIcons = [
    { title: 'Strategy & Engine', desc: 'Resource management, tactics & world-building' },
    { title: 'Party & Social', desc: 'Laughter, bluffs, deduction & fast teams' },
    { title: 'Fast Card Games', desc: 'Quick 15-minute thrillers and easy rules' },
    { title: '2-Player Head-to-Head', desc: 'Duels crafted for couples and rivalry' },
  ];

  return (
    <section
      id="games"
      className="relative py-20 lg:py-28 bg-[#0e0e13] overflow-hidden border-t border-[#20202e]"
    >
      <MonsteraLeaf position="top-right" opacity={0.3} />
      <MonsteraLeaf position="bottom-left" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-8">
          <TornBanner
            title="BOARD GAME LIBRARY & ARENA"
            titleArabic="مكتبة ألعاب الطاولة وبطولات التحدي"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#591010]"
          />
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#9ca3af] mt-3">
            Pair your bubble tea with tabletop games. Whether you love intense tactical battles or lighthearted party games, our collection is curated for unforgettable matches.
          </p>
        </div>

        {/* Feature Navigation Tabs: Library, Game Recommender Quiz, Tournament Leaderboard, Player Board */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'library'
                ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/50 shadow-lg'
                : 'bg-[#161622] text-[#9ca3af] hover:text-white border border-[#252538]'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Full Catalog (50+)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'quiz'
                ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/50 shadow-lg'
                : 'bg-[#161622] text-[#9ca3af] hover:text-white border border-[#252538]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Game Recommender Quiz</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'leaderboard'
                ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/50 shadow-lg'
                : 'bg-[#161622] text-[#9ca3af] hover:text-white border border-[#252538]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tournament Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lfp')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'lfp'
                ? 'bg-[#8c1c1c] text-[#ffcc33] border border-[#ffcc33]/50 shadow-lg'
                : 'bg-[#161622] text-[#9ca3af] hover:text-white border border-[#252538]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Looking For Players</span>
          </button>
        </div>

        {/* TAB 1: Game Recommender Quiz */}
        {activeSubTab === 'quiz' && (
          <div className="mb-12">
            <GameFinder />
          </div>
        )}

        {/* TAB 2: Tournament Leaderboard */}
        {activeSubTab === 'leaderboard' && (
          <div className="mb-12">
            <Leaderboard />
          </div>
        )}

        {/* TAB 3: Looking For Players Board */}
        {activeSubTab === 'lfp' && (
          <div className="mb-12">
            <PlayerBoard />
          </div>
        )}

        {/* TAB 4: Catalog Grid (Always visible or in Library tab) */}
        {activeSubTab === 'library' && (
          <>
            {/* 4 Feature Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {genreIcons.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[#14141e] border border-[#262638] hover:border-[#ffcc33]/40 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#202030] flex items-center justify-center text-[#ffcc33]">
                      <Dices className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#b3231c] font-bebas tracking-wider">MISTER BUBBLE</span>
                  </div>
                  <div>
                    <h4 className="font-bebas text-xl text-white tracking-wide">{item.title}</h4>
                    <p className="text-xs text-[#9ca3af] mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Genre Filter Tabs */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              {BOARD_GAME_CATEGORIES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider whitespace-nowrap transition-all ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white shadow-[0_0_12px_rgba(179,35,28,0.5)] border border-[#ffcc33]/60'
                      : 'bg-[#151520] text-[#9ca3af] hover:text-white hover:bg-[#1e1e2c] border border-[#252538]'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            {/* Featured Board Game Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="p-5 rounded-2xl bg-[#151520]/90 border border-[#27273a] hover:border-[#f2a900]/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-semibold text-[#f2a900] tracking-wider uppercase">
                          {game.category}
                        </span>
                        <h4 className="font-bebas text-2xl text-white tracking-wide group-hover:text-[#ffcc33] transition-colors mt-0.5">
                          {game.title}
                        </h4>
                      </div>
                      {game.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-[#b3231c] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 flex-shrink-0">
                          <Flame className="w-3 h-3 text-[#ffcc33]" />
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-4">
                      {game.description}
                    </p>
                  </div>

                  {/* Game Meta: Players, Time, Difficulty */}
                  <div>
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-[#1b1b26] border border-[#2b2b3d] text-center mb-3">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[#9ca3af] text-[10px]">
                          <Users className="w-3 h-3" />
                          <span>Players</span>
                        </div>
                        <span className="font-bold text-xs text-white mt-0.5 block">{game.players}</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[#9ca3af] text-[10px]">
                          <Clock className="w-3 h-3" />
                          <span>Duration</span>
                        </div>
                        <span className="font-bold text-xs text-white mt-0.5 block">{game.duration}</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[#9ca3af] text-[10px]">
                          <Sparkles className="w-3 h-3" />
                          <span>Level</span>
                        </div>
                        <span
                          className={`font-bold text-xs mt-0.5 block ${
                            game.complexity === 'Easy'
                              ? 'text-emerald-400'
                              : game.complexity === 'Medium'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {game.complexity}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {game.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-medium text-[#94a3b8] px-2 py-0.5 rounded bg-[#1f1f2d]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Staff Assistance & House Rules Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1b1b28] via-[#161622] to-[#1b1b28] border border-[#ffcc33]/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8c1c1c] flex items-center justify-center text-[#ffcc33] flex-shrink-0 shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bebas text-2xl text-white tracking-wide">
                Ask Our Friendly Staff for the Full 50+ Game Catalog!
              </h4>
              <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mt-1">
                Need game recommendations or a quick 2-minute rule explanation? Our staff is always happy to help your group choose the ideal game for your table.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 whitespace-nowrap">
            <a
              href="#reservation"
              className="px-6 py-3 bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white font-bebas text-xl tracking-wider rounded-xl shadow-lg border border-[#ffcc33]/40 transition-all"
            >
              RESERVE A GAME TABLE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
