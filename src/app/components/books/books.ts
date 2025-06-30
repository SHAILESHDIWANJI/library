import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';

import { Book } from '../../models/book.model';

import { Books } from '../../services/book';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    FormsModule
  ],
templateUrl: './books.html',
styleUrls: ['./books.scss'],
 
})
export class BooksComponent implements OnInit {
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];
  displayedBooks: Book[] = [];
  isLoading = true;
  searchQuery = '';
  selectedGenre = 'all';
  genres: string[] = [];
  expandedBookId: string | null = null;
  pageSize = 8;
  currentPage = 0;
  borrowedBooks: Book[] = [];

  constructor(
    private bookService: Books,
    private authService: Auth,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadBorrowedBooks();
  }

  loadBooks(): void {
    this.bookService.getBooksSubject().subscribe(
      (books) => {
        this.allBooks = books;
        this.filteredBooks = [...books];
        this.extractGenres();
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading books:', error);
        this.isLoading = false;
        this.snackBar.open('Failed to load books. Please try again later.', 'Close', { duration: 3000 });
      }
    );
    
 
  }

  extractGenres(): void {
    const genreSet = new Set<string>();
    this.allBooks.forEach(book => genreSet.add(book.genre));
    this.genres = Array.from(genreSet).sort();
  }

  loadBorrowedBooks(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && !this.authService.isAdmin()) {
      this.borrowedBooks = this.bookService.getUserBorrowedBooks(currentUser.id);
    }
  }

  applyFilters(): void {
    this.filteredBooks = this.allBooks.filter(book => {
      const matchesSearch = this.searchQuery === '' || 
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.isbn.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesGenre = this.selectedGenre === 'all' || 
        book.genre === this.selectedGenre;
      
      return matchesSearch && matchesGenre;
    });

    this.currentPage = 0;
    this.updateDisplayedBooks();
  }

  updateDisplayedBooks(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.displayedBooks = this.filteredBooks.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedBooks();
  }

  toggleBookDetails(bookId: string): void {
    this.expandedBookId = this.expandedBookId === bookId ? null : bookId;
  }

  borrowBook(bookId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const success = this.bookService.borrowBook(bookId, currentUser.id);
      if (success) {
        this.snackBar.open('Book borrowed successfully!', 'Close', { duration: 3000 });
        this.loadBorrowedBooks();
        this.loadBooks(); 
      } else {
        this.snackBar.open('Failed to borrow book. Please try again.', 'Close', { duration: 3000 });
      }
    }
  }

  returnBook(bookId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const success = this.bookService.returnBook(bookId, currentUser.id);
      if (success) {
        this.snackBar.open('Book returned successfully!', 'Close', { duration: 3000 });
        this.loadBorrowedBooks();
        this.loadBooks(); 
      } else {
        this.snackBar.open('Failed to return book. Please try again.', 'Close', { duration: 3000 });
      }
    }
  }

  isBookBorrowed(bookId: string): boolean {
    return this.borrowedBooks.some(book => book.id === bookId);
  }

  canBorrowMoreBooks(): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || this.authService.isAdmin()) return false;
    
    return this.borrowedBooks.length < currentUser.borrowLimit;
  }

  getBookImage(book: Book): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33F0'];
    const colorIndex = book.title.length % colors.length;
    return `https://via.placeholder.com/200x300/${colors[colorIndex].substring(1)}/FFFFFF?text=${encodeURIComponent(book.title.substring(0, 20))}`;
  }
}