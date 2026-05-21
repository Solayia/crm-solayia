// Mock API — simule le backend pour GitHub Pages (mode demo)
import { MOCK_USERS, MOCK_PROSPECTS, MOCK_INTERACTIONS } from './mockData';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Simule un JWT
function fakeToken(user) {
  return btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role, fullName: user.fullName }));
}

export const mockAuthApi = {
  async login(email, password) {
    await delay(400);
    const user = MOCK_USERS[email];
    if (!user || user.password !== password) {
      throw { response: { data: { error: { message: 'Email ou mot de passe incorrect' } } } };
    }
    const { password: _, ...userData } = user;
    return { token: fakeToken(userData), user: userData };
  },
  async getMe() {
    await delay(100);
    const { password: _, ...userData } = MOCK_USERS['dolie@solayia.fr'];
    return userData;
  },
  async logout() {
    await delay(100);
    return { success: true };
  },
};

export const mockProspectsApi = {
  async list(filters = {}) {
    await delay(300);
    let results = [...MOCK_PROSPECTS];

    if (filters.tier) results = results.filter((p) => p.tier === filters.tier);
    if (filters.status) results = results.filter((p) => p.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((p) =>
        p.companyName.toLowerCase().includes(q) ||
        (p.categoryName || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q)
      );
    }

    // Sort
    if (filters.sortBy === 'score') {
      results.sort((a, b) => (b.googleScore || 0) - (a.googleScore || 0));
    } else if (filters.sortBy === 'reviews') {
      results.sort((a, b) => (b.googleReviews || 0) - (a.googleReviews || 0));
    }

    return {
      data: results,
      total: results.length,
      tierCounts: {
        A: MOCK_PROSPECTS.filter((p) => p.tier === 'A').length,
        B: MOCK_PROSPECTS.filter((p) => p.tier === 'B').length,
        C: MOCK_PROSPECTS.filter((p) => p.tier === 'C').length,
        D: MOCK_PROSPECTS.filter((p) => p.tier === 'D').length,
      },
    };
  },

  async getById(id) {
    await delay(200);
    const prospect = MOCK_PROSPECTS.find((p) => p.id === id);
    if (!prospect) throw { response: { status: 404 } };
    const interactions = MOCK_INTERACTIONS.filter((i) => i.prospectId === id);
    return { ...prospect, interactions };
  },

  async updateStatus(id, status) {
    await delay(300);
    const prospect = MOCK_PROSPECTS.find((p) => p.id === id);
    if (prospect) prospect.status = status;
    return prospect;
  },
};
