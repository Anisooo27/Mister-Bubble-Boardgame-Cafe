import React, { useState } from 'react';
import { BOARD_GAMES, BOARD_GAME_CATEGORIES } from '../data/gamesData';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { CafeImage } from './CafeImage';
import { PlayerBoard } from './PlayerBoard';
import { GameFinder } from './GameFinder';
import { Leaderboard } from './Leaderboard';
import { useLanguage } from '../context/LanguageContext';
import { Dices, Users, Clock, Flame, Sparkles, BookOpen, Trophy, Compass, Camera } from 'lucide-react';

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
      className="relative py-20 lg:py-28 bg-[#faf6ee] overflow-hidden border-t border-[#ebd8c1]"
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
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#786555] mt-3 font-medium">
            Pair your bubble tea with tabletop games. Whether you love intense tactical battles or lighthearted party games, our collection is curated for unforgettable matches.
          </p>
        </div>

        {/* Real Cafe Board Game Shelf Photo Showcase */}
        <div className="mb-10 p-3 sm:p-4 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-sm max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-6 h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#ebd8c1]">
              <CafeImage
                src="/photos/interior-boardgame-shelf.jpg"
                filename="interior-boardgame-shelf.jpg"
                alt="50+ Board Game Library Shelf on Mezzanine at Mister Bubble Cafe Mostaganem"
                title="50+ Tabletop Game Shelf"
                caption="Mezzanine Floor Game Wall"
                aspectRatio="aspect-auto h-full w-full"
                overlay={true}
              />
            </div>
            <div className="md:col-span-6 space-y-3 px-2 sm:px-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4edd9] text-[#8c1c1c] text-xs font-bold font-bebas tracking-wider border border-[#ebd8c1]">
                <Camera className="w-3.5 h-3.5" />
                <span>REAL MEZZANINE GAME SHELF</span>
              </div>
              <h3 className="font-bebas text-2xl sm:text-3xl text-[#2a1b12] leading-tight">
                Free Tabletop Access with Every Drink or Dessert
              </h3>
              <p className="text-xs sm:text-sm text-[#665547] leading-relaxed">
                Take a look at our real game shelf on the mezzanine floor! From world-class strategy titles like <em>Settlers of Catan</em> and <em>Splendor</em> to fast-paced classics like <em>Uno Flip</em>, <em>Azul</em>, and <em>Jenga</em> — enjoy unlimited game time with your group.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-[#8e5b2e] bg-[#fcf8f0] px-3 py-1.5 rounded-xl border border-[#ebd8c1]">
                  ✓ 50+ Real Boxed Games
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  ✓ Staff Rule Guides
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs: Library, Game Recommender Quiz, Tournament Leaderboard, Player Board */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 shadow-sm ${
              activeSubTab === 'library'
                ? 'bg-[#8c1c1c] text-white border border-[#ffcc33]/40'
                : 'bg-[#ffffff] text-[#554336] hover:text-[#2a1b12] hover:bg-[#f4edd9] border border-[#ebd8c1]'
            }`}
          >
            <Dices className="w-4 h-4" />
            <span>Full Catalog (50+)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 shadow-sm ${
              activeSubTab === 'quiz'
                ? 'bg-[#8c1c1c] text-white border border-[#ffcc33]/40'
                : 'bg-[#ffffff] text-[#554336] hover:text-[#2a1b12] hover:bg-[#f4edd9] border border-[#ebd8c1]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Game Recommender Quiz</span>
          </button>

          <button
            onClick={() => setActiveSubTab('leaderboard')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 shadow-sm ${
              activeSubTab === 'leaderboard'
                ? 'bg-[#8c1c1c] text-white border border-[#ffcc33]/40'
                : 'bg-[#ffffff] text-[#554336] hover:text-[#2a1b12] hover:bg-[#f4edd9] border border-[#ebd8c1]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tournament Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveSubTab('lfp')}
            className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider transition-all flex items-center gap-2 shadow-sm ${
              activeSubTab === 'lfp'
                ? 'bg-[#8c1c1c] text-white border border-[#ffcc33]/40'
                : 'bg-[#ffffff] text-[#554336] hover:text-[#2a1b12] hover:bg-[#f4edd9] border border-[#ebd8c1]'
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
                  className="p-5 rounded-2xl bg-[#ffffff] border border-[#ebd8c1] hover:border-[#8c1c1c] transition-all flex flex-col justify-between shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f4edd9] flex items-center justify-center text-[#8c1c1c]">
                      <Dices className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#8c1c1c] font-bebas tracking-wider">MISTER BUBBLE</span>
                  </div>
                  <div>
                    <h4 className="font-bebas text-xl text-[#2a1b12] tracking-wide">{item.title}</h4>
                    <p className="text-xs text-[#786555] mt-1">{item.desc}</p>
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
                  className={`px-4 py-2 rounded-xl font-bebas text-lg tracking-wider whitespace-nowrap transition-all shadow-sm ${
                    selectedGenre === genre
                      ? 'bg-[#8c1c1c] text-white border border-[#ffcc33]/40'
                      : 'bg-[#ffffff] text-[#554336] hover:text-[#2a1b12] hover:bg-[#f4edd9] border border-[#ebd8c1]'
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
                  className="p-5 rounded-2xl bg-[#ffffff] border border-[#ebd8c1] hover:border-[#8c1c1c] transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-bold text-[#8e5b2e] tracking-wider uppercase">
                          {game.category}
                        </span>
                        <h4 className="font-bebas text-2xl text-[#2a1b12] tracking-wide group-hover:text-[#8c1c1c] transition-colors mt-0.5">
                          {game.title}
                        </h4>
                      </div>
                      {game.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-[#8c1c1c] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 flex-shrink-0">
                          <Flame className="w-3 h-3 text-[#ffcc33]" />
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#665547] leading-relaxed mb-4">
                      {game.description}
                    </p>
                  </div>

                  {/* Game Meta: Players, Time, Difficulty */}
                  <div>
                    <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-center mb-3">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[#786555] text-[10px] font-medium">
                          <Users className="w-3 h-3" />
                          <span>Players</span>
                        </div>
                        <span className="font-bold text-xs text-[#2a1b12] mt-0.5 block">{game.players}</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[#786555] text-[10px] font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Duration</span>
                        </div>
                        <span className="font-bold text-xs text-[#2a1b12] mt-0.5 block">{game.duration}</span>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[#786555] text-[10px] font-medium">
                          <Sparkles className="w-3 h-3" />
                          <span>Level</span>
                        </div>
                        <span
                          className={`font-bold text-xs mt-0.5 block ${
                            game.complexity === 'Easy'
                              ? 'text-emerald-700'
                              : game.complexity === 'Medium'
                              ? 'text-amber-700'
                              : 'text-rose-700'
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
                          className="text-[10px] font-medium text-[#786555] px-2 py-0.5 rounded bg-[#f4edd9]"
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
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8c1c1c] flex items-center justify-center text-[#ffcc33] flex-shrink-0 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bebas text-2xl text-[#2a1b12] tracking-wide">
                Ask Our Friendly Staff for the Full 50+ Game Catalog!
              </h4>
              <p className="text-xs sm:text-sm text-[#786555] leading-relaxed mt-1">
                Need game recommendations or a quick 2-minute rule explanation? Our staff is always happy to help your group choose the ideal game for your table.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 whitespace-nowrap">
            <a
              href="#reservation"
              className="px-6 py-3 bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-xl tracking-wider rounded-xl shadow-sm border border-[#ffcc33]/30 transition-all"
            >
              RESERVE A GAME TABLE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
