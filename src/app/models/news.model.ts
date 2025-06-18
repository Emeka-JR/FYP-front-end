export interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  source?: string;
  image_url?: string;
  tags?: string[];
  created_at: Date;
  updated_at: Date;
  confidence_score?: number;  
}

export interface NewsCreate {
  title: string;
  content: string;
  category: string;
  source?: string;
  image_url?: string;
  tags?: string[];
}

export interface NewsUpdate {
  title?: string;
  content?: string;
  category?: string;
  source?: string;
  image_url?: string;
  tags?: string[];
}

export interface NewsResponse {
  items: News[];
  total: number;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
} 