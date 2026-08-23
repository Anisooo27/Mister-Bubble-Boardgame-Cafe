import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
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
    const fetchLeaderboard = async () => {
      try {
        const remote = await api.getLeaderboard();
        if (remote && remote.length > 0) {
          setLeaderboard(remote);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLeaderboard();
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
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8c1c1c] to-[#591010] flex items-center justify-center text-[#ffcc33] shadow-sm">
            <Trophy className="w-6 h-6 text-[#ffcc33]" />
          </div>
          <div>
            <h3 className="font-bebas text-3xl text-[#2a1b12] tracking-wide">
              {t('leaderboard.title')}
            </h3>
            <p className="text-xs text-[#786555]">
              {t('leaderboard.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#f4edd9] text-[#8c1c1c] border border-[#ebd8c1] text-xs font-bold font-bebas tracking-wider flex items-center gap-1.5 shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#8c1c1c]" />
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
                ? 'bg-[#fcf8f0] border-[#8c1c1c] shadow-xs'
                : player.rank <= 3
                ? 'bg-[#ffffff] border-[#ebd8c1] shadow-xs'
                : 'bg-[#ffffff] border-[#f0e4d2]'
            }`}
          >
            <div className="flex items-center gap-4">
              {getRankBadge(player.rank)}

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bebas text-xl text-[#2a1b12] tracking-wide">
                    {player.playerName}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-[#f4edd9] text-[11px] text-[#8c1c1c] border border-[#ebd8c1] font-semibold">
                    {player.badge}
                  </span>
                </div>

                <div className="text-xs text-[#786555] flex items-center gap-2 mt-0.5">
                  <span className="text-[#3d2e24] font-semibold">{player.favoriteGame}</span>
                  {player.recentAchievement && (
                    <>
                      <span>•</span>
                      <span className="text-[#665547] italic">{player.recentAchievement}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto text-right">
              <div>
                <span className="text-[10px] uppercase text-[#786555] tracking-wider block font-mono font-semibold">
                  {t('leaderboard.wins')}
                </span>
                <span className="font-bebas text-2xl text-[#2a1b12] tracking-wider">
                  {player.wins} 🏆
                </span>
              </div>

              <div className="pl-4 border-l border-[#ebd8c1]">
                <span className="text-[10px] uppercase text-[#8c1c1c] tracking-wider block font-mono font-semibold">
                  {t('leaderboard.points')}
                </span>
                <span className="font-mono text-xl font-black text-[#8c1c1c]">
                  {player.points} PTS
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 p-3.5 rounded-xl bg-[#f4edd9] border border-[#ebd8c1] flex items-center justify-between text-xs text-[#3d2e24]">
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8c1c1c]" />
          <span>Want to climb the ranks? Play any verified match at Mister Bubble and tell the Game Master to record your score!</span>
        </span>
      </div>
    </div>
  );
};
