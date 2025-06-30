export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  genre: string;
  description?: string;
  publishedDate?: string;  
  publisher?: string;      
  pageCount?: number;      
}