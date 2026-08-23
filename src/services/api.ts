import { ReviewItem, EventBooking, TableReservation, DailySpecial, LeaderboardEntry } from '../types';

export interface LiveSyncPayload {
  reviews: ReviewItem[];
  eventBookings: EventBooking[];
  reservations: TableReservation[];
  soldOutItemIds: string[];
  dailySpecial: DailySpecial;
  leaderboard: LeaderboardEntry[];
  seasonalEnabled: boolean;
  loyaltyCards: Record<string, { stamps: number; referralCode: string; lastUpdated: string }>;
}

class ApiService {
  // Sync All
  async getLiveSync(): Promise<LiveSyncPayload | null> {
    try {
      const res = await fetch('/api/live-sync');
      if (!res.ok) throw new Error('Sync failed');
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('API sync fallback to local store', e);
      return null;
    }
  }

  // Reviews
  async getReviews(): Promise<ReviewItem[]> {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Fetch reviews error');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('mb_custom_reviews');
      return stored ? JSON.parse(stored) : [];
    }
  }

  async submitReview(review: Omit<ReviewItem, 'id' | 'date' | 'status'>): Promise<ReviewItem> {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Review API submit offline fallback', e);
    }
    // Fallback
    const newRev: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
      status: 'approved',
    };
    try {
      const stored = localStorage.getItem('mb_custom_reviews');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('mb_custom_reviews', JSON.stringify([newRev, ...list]));
    } catch {}
    return newRev;
  }

  async updateReviewStatus(id: string, status: 'approved' | 'hidden' | 'pending'): Promise<boolean> {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Event Inquiries
  async getEventInquiries(): Promise<EventBooking[]> {
    try {
      const res = await fetch('/api/event-inquiries');
      if (!res.ok) throw new Error('Fetch inquiries error');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('mb_event_bookings');
      return stored ? JSON.parse(stored) : [];
    }
  }

  async submitEventInquiry(inquiry: Omit<EventBooking, 'id' | 'createdAt' | 'status'>): Promise<EventBooking> {
    try {
      const res = await fetch('/api/event-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Event inquiry API submit fallback', e);
    }
    const newInquiry: EventBooking = {
      ...inquiry,
      id: `event-${Date.now()}`,
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };
    try {
      const stored = localStorage.getItem('mb_event_bookings');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('mb_event_bookings', JSON.stringify([newInquiry, ...list]));
    } catch {}
    return newInquiry;
  }

  async updateEventInquiryStatus(id: string, status: 'pending' | 'contacted' | 'confirmed' | 'archived'): Promise<boolean> {
    try {
      const res = await fetch(`/api/event-inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async deleteEventInquiry(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/event-inquiries/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Table Reservations
  async getReservations(): Promise<TableReservation[]> {
    try {
      const res = await fetch('/api/reservations');
      if (!res.ok) throw new Error('Fetch reservations error');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('mb_reservations');
      return stored ? JSON.parse(stored) : [];
    }
  }

  async submitReservation(reservation: Omit<TableReservation, 'id' | 'createdAt' | 'status'>): Promise<TableReservation> {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Reservation API submit fallback', e);
    }
    const newRes: TableReservation = {
      ...reservation,
      id: `res-${Date.now()}`,
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };
    try {
      const stored = localStorage.getItem('mb_reservations');
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem('mb_reservations', JSON.stringify([newRes, ...list]));
    } catch {}
    return newRes;
  }

  async updateReservationStatus(id: string, status: 'pending' | 'confirmed' | 'archived' | 'cancelled'): Promise<boolean> {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async deleteReservation(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Sold Out Items
  async getSoldOutItemIds(): Promise<string[]> {
    try {
      const res = await fetch('/api/sold-out');
      if (!res.ok) throw new Error('Fetch sold out error');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('mb_sold_out_items');
      return stored ? JSON.parse(stored) : [];
    }
  }

  async toggleSoldOutItem(itemId: string): Promise<string[]> {
    try {
      const res = await fetch('/api/sold-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleItemId: itemId }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async resetSoldOutItems(): Promise<string[]> {
    try {
      const res = await fetch('/api/sold-out/reset', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  // Daily Special
  async getDailySpecial(): Promise<DailySpecial | null> {
    try {
      const res = await fetch('/api/daily-special');
      if (!res.ok) throw new Error('Fetch daily special error');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('mb_daily_special');
      return stored ? JSON.parse(stored) : null;
    }
  }

  async saveDailySpecial(special: DailySpecial): Promise<DailySpecial> {
    try {
      const res = await fetch('/api/daily-special', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(special),
      });
      if (res.ok) return await res.json();
    } catch {}
    try {
      localStorage.setItem('mb_daily_special', JSON.stringify(special));
    } catch {}
    return special;
  }

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) throw new Error('Fetch leaderboard error');
      return await res.json();
    } catch {
      const stored = localStorage.getItem('mb_leaderboard');
      return stored ? JSON.parse(stored) : [];
    }
  }

  async addLeaderboardPlayer(player: { playerName: string; favoriteGame: string; wins: number; points: number; badge: string }): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(player),
      });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  async incrementLeaderboardWin(playerId: string): Promise<LeaderboardEntry[]> {
    try {
      const res = await fetch(`/api/leaderboard/${playerId}/win`, { method: 'PATCH' });
      if (res.ok) return await res.json();
    } catch {}
    return [];
  }

  // Seasonal Mode
  async getSeasonalMode(): Promise<boolean> {
    try {
      const res = await fetch('/api/seasonal-mode');
      if (!res.ok) throw new Error('Fetch seasonal mode error');
      const data = await res.json();
      return Boolean(data.enabled);
    } catch {
      const stored = localStorage.getItem('mb_seasonal_mode');
      return stored ? JSON.parse(stored) : false;
    }
  }

  async setSeasonalMode(enabled: boolean): Promise<boolean> {
    try {
      const res = await fetch('/api/seasonal-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (res.ok) {
        const data = await res.json();
        return Boolean(data.enabled);
      }
    } catch {}
    try {
      localStorage.setItem('mb_seasonal_mode', JSON.stringify(enabled));
    } catch {}
    return enabled;
  }

  // Loyalty Card
  async getLoyaltyCard(phone: string): Promise<{ stamps: number; referralCode: string }> {
    try {
      const res = await fetch(`/api/loyalty/${encodeURIComponent(phone)}`);
      if (res.ok) return await res.json();
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
      if (res.ok) return await res.json();
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
      if (res.ok) return await res.json();
    } catch {}
    localStorage.setItem(`mb_loyalty_stamps_${phone}`, '0');
    return {
      stamps: 0,
      referralCode: `BUBBLE-${phone.slice(-4) || 'VIP'}`,
    };
  }
}

export const api = new ApiService();
