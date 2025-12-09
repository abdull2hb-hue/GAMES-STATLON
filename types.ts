
export interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  source: string;
  date: string;
  url?: string;
  rating?: number; // Optional rating out of 10
}

export interface SearchResult {
  text: string;
  sources: Array<{
    title: string;
    uri: string;
  }>;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isAdmin?: boolean;
}

export interface CommunityGame {
  id: string;
  title: string;
  coverUrl: string;
  communityScore: number; // Percentage 0-100
  totalVotes: number;
  userRating?: number; // 0-5 stars
}

export enum ViewMode {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export type Language = 'ar' | 'en';

export const CATEGORIES = [
  "أخبار عامة",
  "PlayStation",
  "Xbox",
  "PC",
  "Nintendo",
  "مراجعات",
  "رياضة إلكترونية"
];

// Simple mapping for categories if needed in English UI
export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  "أخبار عامة": "General News",
  "PlayStation": "PlayStation",
  "Xbox": "Xbox",
  "PC": "PC",
  "Nintendo": "Nintendo",
  "مراجعات": "Reviews",
  "رياضة إلكترونية": "Esports"
};
