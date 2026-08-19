import React, { useState } from 'react';
import { BOARD_GAMES } from '../data/gamesData';
import { BoardGame } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Dices, Users, Clock, Sparkles, Flame, Check, RotateCcw, ArrowRight } from 'lucide-react';

interface GameMatchResult {
  game: BoardGame;
  whyFits: string;
  matchScore: number;
}

export const GameFinder: React.FC = () => {
  const { t, language } = useLanguage();
  const [playerOption, setPlayerOption] = useState<string>('');
  const [timeOption, setTimeOption] = useState<string>('');
  const [moodOption, setMoodOption] = useState<string>('');
  const [matches, setMatches] = useState<GameMatchResult[] | null>(null);

  const handleCalculateMatch = () => {
    if (!playerOption || !timeOption || !moodOption) return;

    const scoredGames: GameMatchResult[] = BOARD_GAMES.map((game) => {
      let score = 0;
      let why = '';

      // 1. Player matching
      if (playerOption === '2' && (game.category === '2-Player Duels' || game.players.includes('2'))) {
        score += 40;
        why = 'Tailor-made for 2 players with tight tactical tension.';
      } else if (playerOption === '3-4' && (game.players.includes('3') || game.players.includes('4'))) {
        score += 40;
        why = 'The quintessential tabletop sweet spot for 3–4 friends.';
      } else if (playerOption === '5+' && (game.players.includes('5') || game.players.includes('8') || game.players.includes('10'))) {
        score += 40;
        why = 'High player-count compatibility keeps the whole group engaged.';
      }

      // 2. Duration matching
      if (timeOption === 'quick' && (game.duration.includes('15') || game.duration.includes('20'))) {
        score += 30;
      } else if (timeOption === 'medium' && (game.duration.includes('30') || game.duration.includes('45'))) {
        score += 30;
      } else if (timeOption === 'long' && (game.duration.includes('60') || game.duration.includes('90'))) {
        score += 30;
      }

      // 3. Mood matching
      if (moodOption === 'chill' && (game.category === 'Party & Social' || game.category === 'Family Classics' || game.tags.includes('Artistic'))) {
        score += 30;
        if (!why) why = 'Relaxed and creative gameplay with low pressure and plenty of conversation.';
      } else if (moodOption === 'competitive' && (game.category === 'Strategy' || game.category === '2-Player Duels' || game.tags.includes('Engine Building'))) {
        score += 30;
        if (!why) why = 'Deep tactical strategy and resource competition with satisfying master moves.';
      } else if (moodOption === 'party' && (game.tags.includes('Bluffing') || game.tags.includes('High Energy') || game.tags.includes('Word Game'))) {
        score += 30;
        if (!why) why = 'Fast-paced laughter, hilarious bluffs, and crowd-pleasing moments.';
      }

      if (game.popular) score += 5;

      return {
        game,
        whyFits: why || 'Great overall match for your table’s group size and session time.',
        matchScore: score,
      };
    });

    // Sort by match score descending
    scoredGames.sort((a, b) => b.matchScore - a.matchScore);
    setMatches(scoredGames.slice(0, 3));
  };

  const handleReset = () => {
    setPlayerOption('');
    setTimeOption('');
    setMoodOption('');
    setMatches(null);
  };

  return (
    <div className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#181827] via-[#141420] to-[#1a1524] border border-[#ffcc33]/40 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#b3231c]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#201d30] border border-[#ffcc33]/40 text-[#ffcc33] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE GAME RECOMMENDER QUIZ</span>
          </div>
          <h3 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">
            {t('finder.title')}
          </h3>
          <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-xl mt-1">
            {t('finder.subtitle')}
          </p>
        </div>

        {matches && (
          <button
            onClick={handleReset}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#222234] hover:bg-[#2d2d44] text-[#ffcc33] text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('finder.restart')}</span>
          </button>
        )}
      </div>

      {!matches ? (
        /* Quiz Steps */
        <div className="space-y-6 relative z-10">
          {/* Question 1: Player Count */}
          <div>
            <label className="block font-bebas text-lg text-[#ffcc33] tracking-wide mb-2.5">
              {t('finder.step1')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: '2', label: '2 Players (Duo / Couple)', sub: '7 Wonders Duel, Chess, Catan Duel' },
                { id: '3-4', label: '3 - 4 Players (Tabletop Sweetspot)', sub: 'Catan, Azul, Splendor, Carcassonne' },
                { id: '5+', label: '5+ Players (Party / Squad)', sub: 'Codenames, UNO Flip, Coup, Dixit' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPlayerOption(opt.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    playerOption === opt.id
                      ? 'bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white border-[#ffcc33] shadow-lg scale-[1.02]'
                      : 'bg-[#181826] hover:bg-[#202032] text-[#cbd5e1] border-[#2c2c3e]'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{opt.label}</span>
                    {playerOption === opt.id && <Check className="w-4 h-4 text-[#ffcc33]" />}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] mt-1">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Session Length */}
          <div>
            <label className="block font-bebas text-lg text-[#ffcc33] tracking-wide mb-2.5">
              {t('finder.step2')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'quick', label: '⚡ Quick Thrill (<20 min)', sub: 'Exploding Kittens, Coup, UNO Flip' },
                { id: 'medium', label: '⏱️ Medium Match (30 - 45 min)', sub: 'Azul, Splendor, Dixit, Carcassonne' },
                { id: 'long', label: '🏆 Epic Session (60+ min)', sub: 'Settlers of Catan, Chess Master' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTimeOption(opt.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    timeOption === opt.id
                      ? 'bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white border-[#ffcc33] shadow-lg scale-[1.02]'
                      : 'bg-[#181826] hover:bg-[#202032] text-[#cbd5e1] border-[#2c2c3e]'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{opt.label}</span>
                    {timeOption === opt.id && <Check className="w-4 h-4 text-[#ffcc33]" />}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] mt-1">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Mood & Vibe */}
          <div>
            <label className="block font-bebas text-lg text-[#ffcc33] tracking-wide mb-2.5">
              {t('finder.step3')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'chill', label: '🌸 Chill & Social', sub: 'Artistic storytelling, tile placing, relaxed banter' },
                { id: 'competitive', label: '⚔️ Tactical & Brainy', sub: 'Resource trading, engine building, outsmarting' },
                { id: 'party', label: '🎉 High Energy & Bluffing', sub: 'Laughter, secret identities, fast team tension' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMoodOption(opt.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    moodOption === opt.id
                      ? 'bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white border-[#ffcc33] shadow-lg scale-[1.02]'
                      : 'bg-[#181826] hover:bg-[#202032] text-[#cbd5e1] border-[#2c2c3e]'
                  }`}
                >
                  <div className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{opt.label}</span>
                    {moodOption === opt.id && <Check className="w-4 h-4 text-[#ffcc33]" />}
                  </div>
                  <div className="text-[11px] text-[#9ca3af] mt-1">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Match Button */}
          <div className="pt-4 text-center sm:text-right">
            <button
              onClick={handleCalculateMatch}
              disabled={!playerOption || !timeOption || !moodOption}
              className={`px-8 py-3.5 rounded-2xl font-bebas text-2xl tracking-wider transition-all shadow-xl ${
                playerOption && timeOption && moodOption
                  ? 'bg-gradient-to-r from-[#ffcc33] to-[#e69500] text-[#0f0f14] font-black hover:scale-105 shadow-[0_0_20px_rgba(255,204,51,0.5)] cursor-pointer'
                  : 'bg-[#222234] text-[#6b7280] cursor-not-allowed border border-[#303046]'
              }`}
            >
              {t('finder.btnMatch')}
            </button>
          </div>
        </div>
      ) : (
        /* Results Grid */
        <div className="space-y-6 relative z-10">
          <h4 className="font-bebas text-2xl text-[#ffcc33] tracking-wide">
            {t('finder.recommendations')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.map((item, idx) => (
              <div
                key={item.game.id}
                className="p-5 rounded-2xl bg-[#181828] border-2 border-[#ffcc33]/50 hover:border-[#ffcc33] shadow-xl flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#ffcc33] text-[#0f0f14] font-bebas text-xs font-black tracking-wider">
                      ★ TOP MATCH #{idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-[#f2a900] uppercase">
                      {item.game.category}
                    </span>
                  </div>

                  <h5 className="font-bebas text-2xl text-white tracking-wide group-hover:text-[#ffcc33] transition-colors mt-1">
                    {item.game.title}
                  </h5>

                  <p className="text-xs text-[#cbd5e1] leading-relaxed mt-2">
                    {item.game.description}
                  </p>

                  {/* Why it fits callout */}
                  <div className="my-3.5 p-3 rounded-xl bg-[#232034] border border-[#ffcc33]/30 text-xs text-[#ffcc33]">
                    <strong className="block text-[10px] uppercase tracking-wider text-[#ff8080] mb-0.5">
                      {t('finder.whyFits')}
                    </strong>
                    {item.whyFits}
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-3 gap-2 py-2 px-2.5 rounded-xl bg-[#141420] text-center text-[10px] text-[#9ca3af] mb-3">
                    <div>
                      <span>Players</span>
                      <strong className="block text-white text-xs mt-0.5">{item.game.players}</strong>
                    </div>
                    <div>
                      <span>Duration</span>
                      <strong className="block text-white text-xs mt-0.5">{item.game.duration}</strong>
                    </div>
                    <div>
                      <span>Level</span>
                      <strong className="block text-white text-xs mt-0.5">{item.game.complexity}</strong>
                    </div>
                  </div>

                  <a
                    href="#reservation"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white font-bebas text-lg tracking-wider font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>RESERVE WITH THIS GAME</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
