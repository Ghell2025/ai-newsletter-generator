import type { Prospect, Product, NewsletterResult } from '@/types';

export interface AIProvider {
  generateNewsletter(
    prospect: Prospect,
    products: Product[]
  ): Promise<NewsletterResult>;
}
