
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

export enum ViewMode {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export const CATEGORIES = [
  "أخبار عامة",
  "PlayStation",
  "Xbox",
  "PC",
  "Nintendo",
  "مراجعات",
  "رياضة إلكترونية"
];