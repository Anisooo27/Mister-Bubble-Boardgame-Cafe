import React, { useState, useEffect } from 'react';
import { ReviewItem } from '../types';
import { REVIEWS_DATA } from '../data/reviewsData';
import { TornBanner } from './TornBanner';
import { MonsteraLeaf } from './MonsteraLeaf';
import { api } from '../services/api';
import { Star, CheckCircle, ExternalLink, Plus, MessageSquare, Sparkles, Send, User } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_DATA);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const remote = await api.getReviews();
        if (remote && remote.length > 0) {
          setReviews(remote.filter((r) => r.status !== 'hidden'));
        }
      } catch {
        // fallback
      }
    };
    fetchReviews();
  }, []);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formVisitType, setFormVisitType] = useState('Bubble Tea & Board Games');
  const [formComment, setFormComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRatingSubmit = async (e: React.FormEvent) => {
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

    const created = await api.submitReview({
      author: formName.trim(),
      rating: formRating,
      text: formComment.trim(),
      highlight: formComment.trim().slice(0, 45) + (formComment.length > 45 ? '...' : ''),
      source: 'In-App Verified',
      visitType: formVisitType,
    });

    const updated = [created, ...reviews];
    setReviews(updated);

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
      className="relative py-20 lg:py-28 bg-[#fcf8f0] overflow-hidden border-t border-[#ebd8c1]"
    >
      <MonsteraLeaf position="top-right" opacity={0.3} />
      <MonsteraLeaf position="bottom-left" opacity={0.25} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <TornBanner
            title="CUSTOMER TESTIMONIALS & RATINGS"
            titleArabic="آراء الزبائن وتقييماتهم"
            gradient="from-[#b3231c] via-[#8c1c1c] to-[#601212]"
          />
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#786555] mt-3 font-medium">
            Real feedback from guests who visited Mister Bubble in Salamandre for bubble teas, waffles, board games, and relaxing moments.
          </p>
        </div>

        {/* 4.9★ Overall Rating Score Banner & Action */}
        <div className="max-w-4xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8c1c1c] to-[#591010] border-2 border-[#f2a900] flex flex-col items-center justify-center shadow-md">
              <span className="font-bebas text-4xl text-[#ffcc33] leading-none">4.9</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">OUT OF 5</span>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[#f2a900] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#f2a900]" />
                ))}
              </div>
              <h3 className="font-bebas text-2xl sm:text-3xl text-[#2a1b12] tracking-wide">
                4.9★ Rated on Google Maps
              </h3>
              <p className="text-xs sm:text-sm text-[#786555]">
                Based on 49+ verified reviews on Google &bull; Boutique de bubble tea in Mostaganem
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              id="btn-leave-review"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#8c1c1c] hover:bg-[#a62222] text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 border border-[#ffcc33]/40 shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#ffcc33]" />
              <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
            </button>

            <a
              href="https://maps.app.goo.gl/4N8Emd2rZtxoBgHQ6"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#fcf8f0] hover:bg-[#f4edd9] border border-[#ebd8c1] hover:border-[#8c1c1c] text-[#2a1b12] text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              <span>Read on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#8c1c1c]" />
            </a>
          </div>
        </div>

        {/* Live "Leave a Review" Form Drawer/Card */}
        {showReviewForm && (
          <div className="max-w-2xl mx-auto mb-12 p-6 sm:p-8 rounded-3xl bg-[#ffffff] border-2 border-[#ebd8c1] shadow-md animate-in fade-in zoom-in-95 duration-200">
            {submittedSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-300">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bebas text-2xl text-[#2a1b12]">Thank You for Your Feedback!</h4>
                <p className="text-xs sm:text-sm text-[#786555]">
                  Your review has been verified and added to the community wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#ebd8c1]">
                  <h4 className="font-bebas text-2xl text-[#2a1b12] tracking-wide flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#8c1c1c]" />
                    <span>Share Your Mister Bubble Experience</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-xs text-[#786555] hover:text-[#2a1b12]"
                  >
                    Cancel
                  </button>
                </div>

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#554336] uppercase tracking-wider mb-1.5">
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
                              ? 'text-[#f2a900] fill-[#f2a900]'
                              : 'text-[#d8c7b5]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-[#8c1c1c]">
                      {formRating} Star{formRating > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Name & Visit Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#554336] mb-1">
                      Your Name / Display Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah K. or Ahmed"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#554336] mb-1">
                      Visit Category
                    </label>
                    <select
                      value={formVisitType}
                      onChange={(e) => setFormVisitType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                    >
                      <option value="Bubble Tea & Board Games">Bubble Tea & Board Games</option>
                      <option value="Takoyaki Waffles & Sweets">Takoyaki Waffles & Sweets</option>
                      <option value="English Speaking Session">English Speaking Session</option>
                      <option value="Cozy Work & Study">Cozy Work & Study</option>
                      <option value="Cat Lovers Meetup">Cat Lovers Meetup</option>
                    </select>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#554336] mb-1">
                    Your Review & Recommendation
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us what you enjoyed most: drinks, game selection, waffles, resident cats..."
                    value={formComment}
                    onChange={(e) => setFormComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcf8f0] border border-[#ebd8c1] text-sm text-[#2a1b12] focus:outline-none focus:border-[#8c1c1c]"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#8c1c1c] hover:bg-[#a62222] text-white font-bebas text-lg tracking-wider text-center shadow-sm border border-[#ffcc33]/40 transition-all flex items-center justify-center gap-2"
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
              className="p-6 rounded-3xl bg-[#ffffff] border border-[#ebd8c1] hover:border-[#8c1c1c] transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                {/* Header: Stars + Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-[#f2a900]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#f2a900]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#786555]">{review.date}</span>
                </div>

                {/* Highlight */}
                {review.highlight && (
                  <h4 className="font-bebas text-xl text-[#8c1c1c] tracking-wide leading-snug mb-2">
                    “{review.highlight}”
                  </h4>
                )}

                {/* Body text */}
                <p className="text-xs sm:text-sm text-[#665547] leading-relaxed mb-4">
                  {review.text}
                </p>
              </div>

              {/* Author & Verification Footer */}
              <div className="pt-3 border-t border-[#ebd8c1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#8c1c1c] text-[#ffcc33] font-bebas text-base flex items-center justify-center border border-[#ffcc33]/40">
                    {review.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2a1b12] flex items-center gap-1">
                      <span>{review.author}</span>
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                    </div>
                    {review.visitType && (
                      <span className="text-[10px] text-[#786555] block">{review.visitType}</span>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-[#786555] bg-[#fcf8f0] px-2 py-0.5 rounded border border-[#ebd8c1]">
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
