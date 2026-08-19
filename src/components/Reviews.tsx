import React, { useState, useEffect } from 'react';
import { ReviewItem } from '../types';
import { REVIEWS_DATA } from '../data/reviewsData';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { Star, CheckCircle, ExternalLink, Plus, MessageSquare, Sparkles, Send, User } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem('mb_custom_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...REVIEWS_DATA];
      }
    } catch {
      // fallback
    }
    return REVIEWS_DATA;
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formVisitType, setFormVisitType] = useState('Bubble Tea & Board Games');
  const [formComment, setFormComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formName.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }

    if (!formComment.trim() || formComment.trim().length < 5) {
      setErrorMsg('Please write a short review (at least 5 characters).');
      return;
    }

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: formName.trim(),
      rating: formRating,
      date: 'Just now',
      text: formComment.trim(),
      highlight: formComment.trim().slice(0, 45) + (formComment.length > 45 ? '...' : ''),
      source: 'In-App Verified',
      visitType: formVisitType,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);

    try {
      const customOnly = updated.filter((r) => r.source === 'In-App Verified');
      localStorage.setItem('mb_custom_reviews', JSON.stringify(customOnly));
    } catch {
      // ignore
    }

    // Trigger confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ffcc33', '#8c1c1c', '#ffffff'],
      });
    } catch {
      // ignore
    }

    setSubmittedSuccess(true);
    setFormName('');
    setFormComment('');
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowReviewForm(false);
    }, 2500);
  };

  return (
    <section
      id="reviews"
      className="relative py-20 lg:py-28 bg-[#0d0d12] overflow-hidden border-t border-[#1f1f2e]"
    >
      <MonsteraLeaf position="top-right" opacity={0.3} />
      <MonsteraLeaf position="bottom-left" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <TornBanner
            title="CUSTOMER TESTIMONIALS &amp; RATINGS"
            titleArabic="آراء الزبائن وتقييماتهم"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#601212]"
          />
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#9ca3af] mt-3">
            Real feedback from guests who visited Mister Bubble in Salamandre for bubble teas, waffles, board games, and relaxing moments.
          </p>
        </div>

        {/* 4.9★ Overall Rating Score Banner & Action */}
        <div className="max-w-4xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-[#141420] border border-[#ffcc33]/30 shadow-[0_0_30px_rgba(242,169,0,0.15)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8c1c1c] to-[#591010] border-2 border-[#f2a900] flex flex-col items-center justify-center shadow-lg">
              <span className="font-bebas text-4xl text-[#ffcc33] leading-none">4.9</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">OUT OF 5</span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[#ffcc33] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#ffcc33]" />
                ))}
              </div>
              <h3 className="font-bebas text-2xl sm:text-3xl text-white tracking-wide">
                4.9★ Rated on Google Maps
              </h3>
              <p className="text-xs sm:text-sm text-[#9ca3af]">
                Based on 49+ verified reviews on Google &bull; Boutique de bubble tea in Mostaganem
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              id="btn-leave-review"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#d12a22] hover:to-[#9e1f1f] text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-[#ffcc33]/50 shadow-md"
            >
              <Plus className="w-4 h-4 text-[#ffcc33]" />
              <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
            </button>

            <a
              href="https://maps.app.goo.gl/4N8Emd2rZtxoBgHQ6"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1e1e2d] hover:bg-[#252538] border border-[#3b3b4f] hover:border-[#ffcc33] text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow"
            >
              <span>Read on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#ffcc33]" />
            </a>
          </div>
        </div>

        {/* Live "Leave a Review" Form Drawer/Card */}
        {showReviewForm && (
          <div className="max-w-2xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-[#161624] border-2 border-[#ffcc33]/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bebas text-2xl text-white">Thank You for Your Feedback!</h4>
                <p className="text-xs sm:text-sm text-[#cbd5e1]">
                  Your review has been verified and added to the community wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#29293e]">
                  <h4 className="font-bebas text-2xl text-white tracking-wide flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ffcc33]" />
                    <span>Share Your Mister Bubble Experience</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-xs text-[#9ca3af] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#cbd5e1] uppercase tracking-wider mb-1.5">
                    Your Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || formRating)
                              ? 'text-[#ffcc33] fill-[#ffcc33]'
                              : 'text-[#4b4b60]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-[#ffcc33]">
                      {formRating} Star{formRating > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Name & Visit Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                      Your Name / Display Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah K. or Ahmed"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e2d] border border-[#2e2e42] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                      Visit Category
                    </label>
                    <select
                      value={formVisitType}
                      onChange={(e) => setFormVisitType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e2d] border border-[#2e2e42] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                    >
                      <option value="Bubble Tea & Board Games">Bubble Tea &amp; Board Games</option>
                      <option value="Takoyaki Waffles & Sweets">Takoyaki Waffles &amp; Sweets</option>
                      <option value="English Speaking Session">English Speaking Session</option>
                      <option value="Cozy Work & Study">Cozy Work &amp; Study</option>
                      <option value="Cat Lovers Meetup">Cat Lovers Meetup</option>
                    </select>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                    Your Review &amp; Recommendation
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what you enjoyed most: drinks, game selection, waffles, resident cats..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1e1e2d] border border-[#2e2e42] text-sm text-white focus:outline-none focus:border-[#ffcc33]"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b3231c] to-[#8c1c1c] hover:from-[#cf2920] hover:to-[#9e1f1f] text-white font-bebas text-lg tracking-wider text-center shadow-lg border border-[#ffcc33]/40 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#ffcc33]" />
                  <span>SUBMIT IN-APP REVIEW</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Reviews Cards Wall */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-[#14141e]/90 border border-[#252538] hover:border-[#f2a900]/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header: Stars + Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-[#ffcc33]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#ffcc33]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#6b7280]">{review.date}</span>
                </div>

                {/* Highlight */}
                {review.highlight && (
                  <h4 className="font-bebas text-xl text-[#ffcc33] tracking-wide leading-snug mb-2">
                    “{review.highlight}”
                  </h4>
                )}

                {/* Body text */}
                <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-4">
                  {review.text}
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-3 border-t border-[#232332] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#8c1c1c] text-[#ffcc33] font-bebas text-base flex items-center justify-center border border-[#ffcc33]/40">
                    {review.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{review.author}</span>
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    </div>
                    {review.visitType && (
                      <span className="text-[10px] text-[#9ca3af] block">{review.visitType}</span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-[#6b7280] bg-[#1a1a26] px-2 py-0.5 rounded border border-[#242436]">
                  {review.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
