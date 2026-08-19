import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Trophy, Medal, Crown, Flame, Award, Shield, Sparkles } from 'lucide-react';

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    rank: 1,
    playerName: 'Yacine K. "The Catan Duke"',
    favoriteGame: 'Settlers of Catan',
    wins: 14,
    points: 420,
    badge: '👑 Grandmaster',
    recentAchievement: 'Undefeated in Longest Road Championship',
  },
  {
    id: 'lead-2',
    rank: 2,
    playerName: 'Amine "Mosaic Master"',
    favoriteGame: 'Azul',
    wins: 11,
    points: 340,
    badge: '🥈 Tile Virtuoso',
    recentAchievement: '98-Point High Score record at Table 6',
  },
  {
    id: 'lead-3',
    rank: 3,
    playerName: 'Sarah M.',
    favoriteGame: 'Splendor & 7 Wonders',
    wins: 9,
    points: 295,
    badge: '🥉 Gem Baron',
    recentAchievement: 'Flawless 15-Prestige Rush',
  },
  {
    id: 'lead-4',
    rank: 4,
    playerName: 'Mehdi "Uno Chaos"',
    favoriteGame: 'UNO Flip',
    wins: 7,
    points: 210,
    badge: '⚡ Wildcard Ninja',
    recentAchievement: 'Reversed 4 consecutive Draw-5 attacks',
  },
  {
    id: 'lead-5',
    rank: 5,
    playerName: 'Nour & Maya Duo',
    favoriteGame: 'Codenames Duet',
    wins: 6,
    points: 180,
    badge: '🕵️ Spymaster Duo',
    recentAchievement: 'Zero-assassin streak across 8 matches',
  },
];

export const Leaderboard: React.FC = () => {
  const { t, language } = useLanguage();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(DEFAULT_LEADERBOARD);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mb_leaderboard');
      if (saved) {
        setLeaderboard(JSON.parse(saved));
      } else {
        localStorage.setItem('mb_leaderboard', JSON.stringify(DEFAULT_LEADERBOARD));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-300 to-amber-500 text-[#0f0f14] font-black flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown className="w-5 h-5" />
          </div>
        );
      case 2:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-[#0f0f14] font-black flex items-center justify-center shadow-lg">
            <Medal className="w-5 h-5" />
          </div>
        );
      case 3:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white font-black flex items-center justify-center shadow-lg">
            <Award className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-[#232336] text-[#9ca3af] font-mono font-bold flex items-center justify-center border border-[#303046]">
            #{rank}
          </div>
        );
    }
  };

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[#141420] border border-[#2c2c40] shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f2a900] to-[#b3231c] flex items-center justify-center text-[#0f0f14] shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bebas text-3xl text-white tracking-wide">
              {t('leaderboard.title')}
            </h3>
            <p className="text-xs text-[#cbd5e1]">
              {t('leaderboard.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#ffcc33]/15 text-[#ffcc33] border border-[#ffcc33]/40 text-xs font-bold font-bebas tracking-wider flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#ffcc33]" />
            <span>SEASON 2026 ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {leaderboard.map((player) => (
          <div
            key={player.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              player.rank === 1
                ? 'bg-gradient-to-r from-[#221c16] via-[#1a1728] to-[#1a1524] border-[#ffcc33]/60 shadow-lg'
                : player.rank <= 3
                ? 'bg-[#181827] border-[#363650]'
                : 'bg-[#151522] border-[#252536]'
            }`}
          >
            <div className="flex items-center gap-4">
              {getRankBadge(player.rank)}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bebas text-xl text-white tracking-wide">
                    {player.playerName}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-[#252338] text-[11px] text-[#ffcc33] border border-[#ffcc33]/30 font-medium">
                    {player.badge}
                  </span>
                </div>

                <div className="text-xs text-[#9ca3af] flex items-center gap-2 mt-0.5">
                  <span className="text-[#cbd5e1] font-semibold">{player.favoriteGame}</span>
                  {player.recentAchievement && (
                    <>
                      <span>•</span>
                      <span className="text-[#a1a1aa] italic">{player.recentAchievement}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto text-right">
              <div>
                <span className="text-[10px] uppercase text-[#9ca3af] tracking-wider block font-mono">
                  {t('leaderboard.wins')}
                </span>
                <span className="font-bebas text-2xl text-white tracking-wider">
                  {player.wins} 🏆
                </span>
              </div>

              <div className="pl-4 border-l border-[#2e2e44]">
                <span className="text-[10px] uppercase text-[#ffcc33] tracking-wider block font-mono">
                  {t('leaderboard.points')}
                </span>
                <span className="font-mono text-xl font-black text-[#ffcc33]">
                  {player.points} PTS
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3.5 rounded-xl bg-[#191928] border border-[#2d2d42] flex items-center justify-between text-xs text-[#cbd5e1]">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ffcc33]" />
          <span>Want to climb the ranks? Play any verified match at Mister Bubble and tell the Game Master to record your score!</span>
        </span>
      </div>
    </div>
  );
};
