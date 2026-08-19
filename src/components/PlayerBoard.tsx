import React, { useState, useEffect } from 'react';
import { PlayerPost } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Users,
  Dices,
  Plus,
  Clock,
  Trash2,
  Sparkles,
  MessageSquare,
  CheckCircle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SEED_POSTS: PlayerPost[] = [
  {
    id: 'seed-1',
    author: 'Amine K.',
    gameName: 'Settlers of Catan',
    seatsNeeded: 2,
    timeDescription: 'Tonight ~7:30 PM (Mezzanine Table 3)',
    notes: 'Beginners welcome! We will explain the rules over Boba.',
    createdAt: '15 mins ago',
    isUserCreated: false,
  },
  {
    id: 'seed-2',
    author: 'Yacine & Sarah',
    gameName: 'Azul & Splendor',
    seatsNeeded: 1,
    timeDescription: 'Saturday 4:00 PM',
    notes: 'Chill strategic game with sparkling iced tea.',
    createdAt: '1 hour ago',
    isUserCreated: false,
  },
  {
    id: 'seed-3',
    author: 'Mehdi (Game Master)',
    gameName: 'Secret Hitler / Social Deduction',
    seatsNeeded: 4,
    timeDescription: 'Friday 8:00 PM',
    notes: 'Big group party game! Lots of laughs guaranteed.',
    createdAt: '3 hours ago',
    isUserCreated: false,
  },
];

export const PlayerBoard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [posts, setPosts] = useState<PlayerPost[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [gameName, setGameName] = useState('');
  const [seatsNeeded, setSeatsNeeded] = useState(2);
  const [timeDescription, setTimeDescription] = useState('Tonight ~7:00 PM');
  const [notes, setNotes] = useState('');
  const [joinedMap, setJoinedMap] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mb_player_posts');
      if (stored) {
        setPosts(JSON.parse(stored));
      } else {
        setPosts(SEED_POSTS);
        localStorage.setItem('mb_player_posts', JSON.stringify(SEED_POSTS));
      }
    } catch {
      setPosts(SEED_POSTS);
    }
  }, []);

  const savePosts = (newPosts: PlayerPost[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem('mb_player_posts', JSON.stringify(newPosts));
    } catch {
      // ignore
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !gameName.trim()) return;

    // Basic client-side max length & moderation hook
    const newPost: PlayerPost = {
      id: `post-${Date.now()}`,
      author: author.trim().slice(0, 30),
      gameName: gameName.trim().slice(0, 40),
      seatsNeeded: Number(seatsNeeded) || 1,
      timeDescription: timeDescription.trim().slice(0, 40) || 'Tonight',
      notes: notes.trim().slice(0, 120),
      createdAt: 'Just now',
      isUserCreated: true,
    };

    const updated = [newPost, ...posts];
    savePosts(updated);

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#ffcc33', '#8c1c1c'],
      });
    } catch {
      // ignore
    }

    setAuthor('');
    setGameName('');
    setNotes('');
    setIsFormOpen(false);
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter((p) => p.id !== id);
    savePosts(updated);
  };

  const handleJoinClick = (id: string) => {
    setJoinedMap((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setJoinedMap((prev) => ({ ...prev, [id]: false }));
    }, 3000);
  };

  return (
    <div className="mt-16 pt-12 border-t border-[#232336]" id="player-board">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8c1c1c]/30 border border-[#f2a900]/40 text-[#ffcc33] text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>COMMUNITY BULLETIN BOARD</span>
          </div>
          <h3 className="font-bebas text-3xl sm:text-4xl text-white tracking-wider">
            {t('playerBoard.title')}
          </h3>
          <p className="text-xs sm:text-sm text-[#9ca3af] max-w-xl">
            {t('playerBoard.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="py-2.5 px-5 rounded-xl bg-[#ffcc33] hover:bg-[#ffe066] text-[#0f0f14] font-bebas text-lg tracking-wider font-bold transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
        >
          {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{t('playerBoard.btnPost')}</span>
        </button>
      </div>

      {/* Post creation drawer form */}
      {isFormOpen && (
        <form
          onSubmit={handleCreatePost}
          className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-[#1a1724] to-[#14121d] border-2 border-[#ffcc33]/40 shadow-2xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#2d273a]">
            <h4 className="font-bebas text-xl text-[#ffcc33] flex items-center gap-2">
              <Dices className="w-5 h-5" />
              <span>Post Your Open Table</span>
            </h4>
            <span className="text-xs text-[#9ca3af]">Looking for teammates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                {t('playerBoard.name')} *
              </label>
              <input
                type="text"
                required
                maxLength={30}
                placeholder="e.g. Karim / @karim_dz"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14121a] border border-[#2e2a3c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                {t('playerBoard.game')} *
              </label>
              <input
                type="text"
                required
                maxLength={40}
                placeholder="e.g. Catan, Azul, Uno..."
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14121a] border border-[#2e2a3c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                {t('playerBoard.seats')}
              </label>
              <select
                value={seatsNeeded}
                onChange={(e) => setSeatsNeeded(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14121a] border border-[#2e2a3c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
              >
                <option value={1}>1 Player Needed</option>
                <option value={2}>2 Players Needed</option>
                <option value={3}>3 Players Needed</option>
                <option value={4}>4+ Players Needed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                {t('playerBoard.time')}
              </label>
              <input
                type="text"
                maxLength={40}
                placeholder="e.g. Tonight ~7:00 PM"
                value={timeDescription}
                onChange={(e) => setTimeDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14121a] border border-[#2e2a3c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
              Short Note or Table Location (Optional)
            </label>
            <input
              type="text"
              maxLength={120}
              placeholder="e.g. We are seated at the couch by the window! Happy to teach."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#14121a] border border-[#2e2a3c] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#222232] text-xs font-bold text-[#9ca3af] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] text-white font-bebas text-lg tracking-wider border border-[#ffcc33]/40 shadow-md"
            >
              {t('playerBoard.submit')}
            </button>
          </div>
        </form>
      )}

      {/* Posts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => {
          const isJoined = joinedMap[post.id];

          return (
            <div
              key={post.id}
              className="relative p-5 rounded-2xl bg-[#15141f] border border-[#2a2638] hover:border-[#ffcc33]/50 transition-all shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#8c1c1c] text-[#ffcc33] flex items-center justify-center font-bebas text-base border border-[#ffcc33]/30">
                      {post.author.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm leading-tight">{post.author}</h5>
                      <span className="text-[10px] text-[#9ca3af]">{post.createdAt}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffcc33]/10 border border-[#ffcc33]/40 text-[#ffcc33] font-bold text-[11px] flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>Need {post.seatsNeeded}</span>
                  </span>
                </div>

                <div className="my-3">
                  <span className="text-[10px] text-[#9ca3af] uppercase font-bold tracking-wider">Game Choice:</span>
                  <h4 className="font-bebas text-2xl text-[#ffcc33] text-gold-glow leading-none mt-0.5">
                    {post.gameName}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#cbd5e1] mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#ffcc33]" />
                  <span>{post.timeDescription}</span>
                </div>

                {post.notes && (
                  <p className="text-xs text-[#9ca3af] bg-[#1a1825] p-2.5 rounded-xl border border-[#272334] italic">
                    "{post.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#232030] flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={() => handleJoinClick(post.id)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isJoined
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#222030] hover:bg-[#ffcc33] hover:text-[#0d0d10] text-[#ffcc33] border border-[#ffcc33]/30'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Table Joined! Say hello in café 👋</span>
                    </>
                  ) : (
                    <>
                      <Dices className="w-3.5 h-3.5" />
                      <span>{t('playerBoard.join')}</span>
                    </>
                  )}
                </button>

                {post.isUserCreated && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 rounded-lg text-[#ef4444] hover:bg-red-950/30 transition-colors"
                    title="Remove your note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
