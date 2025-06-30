export interface Transaction {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned';
}