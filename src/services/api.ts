import { ReviewItem, EventBooking, TableReservation, DailySpecial, LeaderboardEntry } from '../types';

export interface LiveSyncPayload {
  reviews: ReviewItem[];
  eventBookings: EventBooking[];
  reservations: TableReservation[];
  soldOutItemIds: string[];
  dailySpecial: DailySpecial;
  leaderboard: LeaderboardEntry[];
  seasonalEnabled: boolean;
}

class ApiService {
  private isJson(res: Response): boolean {
    const contentType = res.headers.get('content-type');
    return Boolean(contentType && contentType.includes('application/json'));
  }

  // Sync All state in one call
  async getLiveSync(): Promise<LiveSyncPayload | null> {
    try {
      const res = await fetch('/api/live-sync');
      if (res.ok && this.isJson(res)) {
        const data: LiveSyncPayload = await res.json();
        // Update local cache
        if (data.reviews) localStorage.setItem('mb_custom_reviews', JSON.stringify(data.reviews));
        if (data.eventBookings) localStorage.setItem('mb_event_bookings', JSON.stringify(data.eventBookings));
        if (data.reservations) localStorage.setItem('mb_reservations', JSON.stringify(data.reservations));
        if (data.soldOutItemIds) localStorage.setItem('mb_sold_out_items', JSON.stringify(data.soldOutItemIds));
        if (data.dailySpecial) localStorage.setItem('mb_daily_special', JSON.stringify(data.dailySpecial));
        if (data.leaderboard) localStorage.setItem('mb_leaderboard', JSON.stringify(data.leaderboard));
        if (typeof data.seasonalEnabled === 'boolean') localStorage.setItem('mb_seasonal_mode', JSON.stringify(data.seasonalEnabled));
        return data;
      }
    } catch (e) {
      console.warn('API getLiveSync offline fallback to local store', e);
    }
    return null;
  }

  // 1. Reviews
  async getReviews(): Promise<ReviewItem[]> {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('mb_custom_reviews', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('getReviews fallback to local store', e);
    }
    const stored = localStorage.getItem('mb_custom_reviews');
    return stored ? JSON.parse(stored) : [];
  }

  async submitReview(review: Omit<ReviewItem, 'id' | 'date' | 'status'>): Promise<ReviewItem> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (res.ok && this.isJson(res)) {
        const created: ReviewItem = await res.json();
        // Update local cache
        const stored = localStorage.getItem('mb_custom_reviews');
        const list: ReviewItem[] = stored ? JSON.parse(stored) : [];
        const updated = [created, ...list.filter((r) => r.id !== created.id)];
        localStorage.setItem('mb_custom_reviews', JSON.stringify(updated));
        return created;
      }
    } catch (e) {
      console.warn('submitReview offline fallback', e);
    }
    // Local fallback
    const fallbackReview: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      status: 'approved',
    };
    try {
      const stored = localStorage.getItem('mb_custom_reviews');
      const list: ReviewItem[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('mb_custom_reviews', JSON.stringify([fallbackReview, ...list]));
    } catch {}
    return fallbackReview;
  }

  async updateReviewStatus(id: string, status: 'approved' | 'hidden' | 'pending'): Promise<boolean> {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const stored = localStorage.getItem('mb_custom_reviews');
        if (stored) {
          const list: ReviewItem[] = JSON.parse(stored);
          const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
          localStorage.setItem('mb_custom_reviews', JSON.stringify(updated));
        }
        return true;
      }
    } catch {}
    // Local update fallback
    try {
      const stored = localStorage.getItem('mb_custom_reviews');
      if (stored) {
        const list: ReviewItem[] = JSON.parse(stored);
        const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
        localStorage.setItem('mb_custom_reviews', JSON.stringify(updated));
      }
    } catch {}
    return true;
  }

  // 2. Event Inquiries
  async getEventInquiries(): Promise<EventBooking[]> {
    try {
      const res = await fetch('/api/event-inquiries');
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('mb_event_bookings', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('getEventInquiries fallback to local store', e);
    }
    const stored = localStorage.getItem('mb_event_bookings');
    return stored ? JSON.parse(stored) : [];
  }

  async submitEventInquiry(inquiry: Omit<EventBooking, 'id' | 'createdAt' | 'status'>): Promise<EventBooking> {
    try {
      const res = await fetch('/api/event-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      if (res.ok && this.isJson(res)) {
        const created: EventBooking = await res.json();
        const stored = localStorage.getItem('mb_event_bookings');
        const list: EventBooking[] = stored ? JSON.parse(stored) : [];
        const updated = [created, ...list.filter((b) => b.id !== created.id)];
        localStorage.setItem('mb_event_bookings', JSON.stringify(updated));
        return created;
      }
    } catch (e) {
      console.warn('submitEventInquiry offline fallback', e);
    }
    const fallbackInquiry: EventBooking = {
      ...inquiry,
      id: `event-${Date.now()}`,
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };
    try {
      const stored = localStorage.getItem('mb_event_bookings');
      const list: EventBooking[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('mb_event_bookings', JSON.stringify([fallbackInquiry, ...list]));
    } catch {}
    return fallbackInquiry;
  }

  async updateEventInquiryStatus(id: string, status: 'pending' | 'contacted' | 'confirmed' | 'archived'): Promise<boolean> {
    try {
      const res = await fetch(`/api/event-inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const stored = localStorage.getItem('mb_event_bookings');
        if (stored) {
          const list: EventBooking[] = JSON.parse(stored);
          const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
          localStorage.setItem('mb_event_bookings', JSON.stringify(updated));
        }
        return true;
      }
    } catch {}
    try {
      const stored = localStorage.getItem('mb_event_bookings');
      if (stored) {
        const list: EventBooking[] = JSON.parse(stored);
        const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
        localStorage.setItem('mb_event_bookings', JSON.stringify(updated));
      }
    } catch {}
    return true;
  }

  async deleteEventInquiry(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/event-inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const stored = localStorage.getItem('mb_event_bookings');
        if (stored) {
          const list: EventBooking[] = JSON.parse(stored);
          localStorage.setItem('mb_event_bookings', JSON.stringify(list.filter((b) => b.id !== id)));
        }
        return true;
      }
    } catch {}
    try {
      const stored = localStorage.getItem('mb_event_bookings');
      if (stored) {
        const list: EventBooking[] = JSON.parse(stored);
        localStorage.setItem('mb_event_bookings', JSON.stringify(list.filter((b) => b.id !== id)));
      }
    } catch {}
    return true;
  }

  // 3. Table Reservations
  async getReservations(): Promise<TableReservation[]> {
    try {
      const res = await fetch('/api/reservations');
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('mb_reservations', JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {
      console.warn('getReservations fallback to local store', e);
    }
    const stored = localStorage.getItem('mb_reservations');
    return stored ? JSON.parse(stored) : [];
  }

  async submitReservation(reservation: Omit<TableReservation, 'id' | 'createdAt' | 'status'>): Promise<TableReservation> {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
      });
      if (res.ok && this.isJson(res)) {
        const created: TableReservation = await res.json();
        const stored = localStorage.getItem('mb_reservations');
        const list: TableReservation[] = stored ? JSON.parse(stored) : [];
        const updated = [created, ...list.filter((r) => r.id !== created.id)];
        localStorage.setItem('mb_reservations', JSON.stringify(updated));
        return created;
      }
    } catch (e) {
      console.warn('submitReservation offline fallback', e);
    }
    const fallbackRes: TableReservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };
    try {
      const stored = localStorage.getItem('mb_reservations');
      const list: TableReservation[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('mb_reservations', JSON.stringify([fallbackRes, ...list]));
    } catch {}
    return fallbackRes;
  }

  async updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'archived' | 'cancelled'): Promise<boolean> {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const stored = localStorage.getItem('mb_reservations');
        if (stored) {
          const list: TableReservation[] = JSON.parse(stored);
          const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
          localStorage.setItem('mb_reservations', JSON.stringify(updated));
        }
        return true;
      }
    } catch {}
    try {
      const stored = localStorage.getItem('mb_reservations');
      if (stored) {
        const list: TableReservation[] = JSON.parse(stored);
        const updated = list.map((r) => (r.id === id ? { ...r, status } : r));
        localStorage.setItem('mb_reservations', JSON.stringify(updated));
      }
    } catch {}
    return true;
  }

  async deleteReservation(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const stored = localStorage.getItem('mb_reservations');
        if (stored) {
          const list: TableReservation[] = JSON.parse(stored);
          localStorage.setItem('mb_reservations', JSON.stringify(list.filter((r) => r.id !== id)));
        }
        return true;
      }
    } catch {}
    try {
      const stored = localStorage.getItem('mb_reservations');
      if (stored) {
        const list: TableReservation[] = JSON.parse(stored);
        localStorage.setItem('mb_reservations', JSON.stringify(list.filter((r) => r.id !== id)));
      }
    } catch {}
    return true;
  }

  // 4. Sold Out Items
  async getSoldOutItemIds(): Promise<string[]> {
    try {
      const res = await fetch('/api/sold-out');
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('mb_sold_out_items', JSON.stringify(data));
          return data;
        }
      }
    } catch {}
    const stored = localStorage.getItem('mb_sold_out_items');
    return stored ? JSON.parse(stored) : [];
  }

  async toggleSoldOutItem(itemId: string): Promise<string[]> {
    try {
      const res = await fetch('/api/sold-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleItemId: itemId }),
      });
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        localStorage.setItem('mb_sold_out_items', JSON.stringify(data));
        return data;
      }
    } catch {}
    const stored = localStorage.getItem('mb_sold_out_items');
    const current: string[] = stored ? JSON.parse(stored) : [];
    const updated = current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId];
    localStorage.setItem('mb_sold_out_items', JSON.stringify(updated));
    return updated;
  }

  async resetSoldOutItems(): Promise<string[]> {
    try {
      const res = await fetch('/api/sold-out/reset', { method: 'POST' });
      if (res.ok && this.isJson(res)) {
        localStorage.setItem('mb_sold_out_items', JSON.stringify([]));
        return [];
      }
    } catch {}
    localStorage.setItem('mb_sold_out_items', JSON.stringify([]));
    return [];
  }

  // 5. Daily Special
  async getDailySpecial(): Promise<DailySpecial | null> {
    try {
      const res = await fetch('/api/daily-special');
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        if (data && data.title) {
          localStorage.setItem('mb_daily_special', JSON.stringify(data));
          return data;
        }
      }
    } catch {}
    const stored = localStorage.getItem('mb_daily_special');
    return stored ? JSON.parse(stored) : null;
  }

  async saveDailySpecial(special: DailySpecial): Promise<DailySpecial> {
    try {
      const res = await fetch('/api/daily-special', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(special),
      });
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        localStorage.setItem('mb_daily_special', JSON.stringify(data));
        return data;
      }
    } catch {}
    localStorage.setItem('mb_daily_special', JSON.stringify(special));
    return special;
  }

  // 6. Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem('mb_leaderboard', JSON.stringify(data));
          return data;
        }
      }
    } catch {}
    const stored = localStorage.getItem('mb_leaderboard');
    return stored ? JSON.parse(stored) : [];
  }

  async addLeaderboardPlayer(player: { playerName: string; favoriteGame: string; wins: number; points: number; badge: string }): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player),
      });
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        localStorage.setItem('mb_leaderboard', JSON.stringify(data));
        return data;
      }
    } catch {}
    const stored = localStorage.getItem('mb_leaderboard');
    const current: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
    const newEntry: LeaderboardEntry = {
      id: `lead-${Date.now()}`,
      rank: 1,
      ...player,
    };
    const updated = [...current, newEntry].sort((a, b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));
    localStorage.setItem('mb_leaderboard', JSON.stringify(updated));
    return updated;
  }

  async incrementLeaderboardWin(playerId: string): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch(`/api/leaderboard/${playerId}/win`, { method: 'PATCH' });
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        localStorage.setItem('mb_leaderboard', JSON.stringify(data));
        return data;
      }
    } catch {}
    const stored = localStorage.getItem('mb_leaderboard');
    const current: LeaderboardEntry[] = stored ? JSON.parse(stored) : [];
    const updated = current
      .map((p) => (p.id === playerId ? { ...p, wins: p.wins + 1, points: p.points + 30 } : p))
      .sort((a, b) => b.points - a.points)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
    localStorage.setItem('mb_leaderboard', JSON.stringify(updated));
    return updated;
  }

  // 7. Seasonal Mode
  async getSeasonalMode(): Promise<boolean> {
    try {
      const res = await fetch('/api/seasonal-mode');
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        localStorage.setItem('mb_seasonal_mode', JSON.stringify(Boolean(data.enabled)));
        return Boolean(data.enabled);
      }
    } catch {}
    const stored = localStorage.getItem('mb_seasonal_mode');
    return stored ? JSON.parse(stored) : false;
  }

  async setSeasonalMode(enabled: boolean): Promise<boolean> {
    try {
      const res = await fetch('/api/seasonal-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (res.ok && this.isJson(res)) {
        const data = await res.json();
        localStorage.setItem('mb_seasonal_mode', JSON.stringify(Boolean(data.enabled)));
        return Boolean(data.enabled);
      }
    } catch {}
    localStorage.setItem('mb_seasonal_mode', JSON.stringify(enabled));
    return enabled;
  }

  // 8. Loyalty Stamps
  async getLoyaltyCard(phone: string): Promise<{ stamps: number; referralCode: string }> {
    try {
      const res = await fetch(`/api/loyalty/${encodeURIComponent(phone)}`);
      if (res.ok && this.isJson(res)) return await res.json();
    } catch {}
    const stored = localStorage.getItem(`mb_loyalty_stamps_${phone}`);
    return {
      stamps: stored ? Number(stored) : 0,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
    };
  }

  async addLoyaltyStamp(phone: string, count: number = 1): Promise<{ stamps: number; referralCode: string }> {
    try {
      const res = await fetch(`/api/loyalty/${encodeURIComponent(phone)}/stamp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      if (res.ok && this.isJson(res)) return await res.json();
    } catch {}
    const current = Number(localStorage.getItem(`mb_loyalty_stamps_${phone}`)) || 0;
    const updated = Math.min(8, current + count);
    localStorage.setItem(`mb_loyalty_stamps_${phone}`, String(updated));
    return {
      stamps: updated,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
    };
  }

  async resetLoyaltyCard(phone: string): Promise<{ stamps: number; referralCode: string }> {
    try {
      const res = await fetch(`/api/loyalty/${encodeURIComponent(phone)}/reset`, {
        method: 'POST',
      });
      if (res.ok && this.isJson(res)) return await res.json();
    } catch {}
    localStorage.setItem(`mb_loyalty_stamps_${phone}`, '0');
    return {
      stamps: 0,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
    };
  }
}

export const api = new ApiService();
