import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class Books {
 private booksSubject = new BehaviorSubject<Book[]>([
    {
      id: '1',
      title: 'Angular Complete Guide',
      author: 'John Doe',
      isbn: '978-1234567890',
      totalCopies: 5,
      availableCopies: 3,
      genre: 'Technology',
      description: 'Complete guide to Angular development'
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      author: 'Jane Smith',
      isbn: '978-0987654321',
      totalCopies: 3,
      availableCopies: 2,
      genre: 'Technology',
      description: 'Learn JavaScript from basics to advanced'
    }
  ]);
getBooksSubject() {
    return this.booksSubject;
  }
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  public books$ = this.booksSubject.asObservable();
  public transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    const savedBooks = localStorage.getItem('books');
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedBooks) {
      this.booksSubject.next(JSON.parse(savedBooks));
    }
    if (savedTransactions) {
      this.transactionsSubject.next(JSON.parse(savedTransactions));
    }
  }

  getBooks(): Book[] {
    return this.booksSubject.value;
  }

  addBook(book: Omit<Book, 'id'>): void {
    const newBook: Book = {
      ...book,
      id: Date.now().toString()
    };
    const books = [...this.booksSubject.value, newBook];
    this.booksSubject.next(books);
    localStorage.setItem('books', JSON.stringify(books));
  }

  updateBook(book: Book): void {
    const books = this.booksSubject.value.map(b => b.id === book.id ? book : b);
    this.booksSubject.next(books);
    localStorage.setItem('books', JSON.stringify(books));
  }

  deleteBook(bookId: string): void {
    const books = this.booksSubject.value.filter(b => b.id !== bookId);
    this.booksSubject.next(books);
    localStorage.setItem('books', JSON.stringify(books));
  }

  borrowBook(bookId: string, userId: string): boolean {
    const books = this.booksSubject.value;
    const book = books.find(b => b.id === bookId);
    
    if (book && book.availableCopies > 0) {
      book.availableCopies--;
      
      const transaction: Transaction = {
        id: Date.now().toString(),
        userId,
        bookId,
        borrowDate: new Date(),
        status: 'borrowed'
      };
      
      const transactions = [...this.transactionsSubject.value, transaction];
      this.transactionsSubject.next(transactions);
      this.booksSubject.next(books);
      
      localStorage.setItem('books', JSON.stringify(books));
      localStorage.setItem('transactions', JSON.stringify(transactions));
      return true;
    }
    return false;
  }

  returnBook(bookId: string, userId: string): boolean {
    const transactions = this.transactionsSubject.value;
    const transaction = transactions.find(t => 
      t.bookId === bookId && t.userId === userId && t.status === 'borrowed'
    );
    
    if (transaction) {
      transaction.status = 'returned';
      transaction.returnDate = new Date();
      
      const books = this.booksSubject.value;
      const book = books.find(b => b.id === bookId);
      if (book) {
        book.availableCopies++;
      }
      
      this.booksSubject.next(books);
      this.transactionsSubject.next(transactions);
      
      localStorage.setItem('books', JSON.stringify(books));
      localStorage.setItem('transactions', JSON.stringify(transactions));
      return true;
    }
    return false;
  }

  getUserBorrowedBooks(userId: string): Book[] {
    const transactions = this.transactionsSubject.value;
    const borrowedTransactions = transactions.filter(t => 
      t.userId === userId && t.status === 'borrowed'
    );
    
    const books = this.booksSubject.value;
    return borrowedTransactions.map(t => 
      books.find(b => b.id === t.bookId)!
    ).filter(Boolean);
  }

  getTransactions(): Transaction[] {
    return this.transactionsSubject.value;
  }
}
