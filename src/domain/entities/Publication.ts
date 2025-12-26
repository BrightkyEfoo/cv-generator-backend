export interface Publication {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publicationDate: string;
  url?: string;
  doi?: string;
  description?: string;
  type: 'article' | 'book' | 'paper' | 'patent' | 'thesis' | 'other';
}
