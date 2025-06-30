export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  borrowedBooks: string[];
  borrowLimit: number;
}