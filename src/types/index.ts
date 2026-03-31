export interface Prospect {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  interests: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  features: string[];
}

export interface ParsedData {
  prospects: Prospect[];
  products: Product[];
}

export interface NewsletterResult {
  prospectId: string;
  prospectName: string;
  prospectEmail: string;
  prospectCompany: string;
  subject: string;
  htmlContent: string;
  matchedProducts: Product[];
}

export interface GenerationEvent {
  type: 'start' | 'chunk' | 'complete' | 'done';
  prospectId?: string;
  prospectName?: string;
  html?: string;
  newsletter?: NewsletterResult;
  current?: number;
  total?: number;
}
