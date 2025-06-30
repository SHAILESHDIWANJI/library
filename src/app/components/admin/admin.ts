import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Book } from '../../models/book.model';
import { User } from '../../models/user.model';
import { Auth } from '../../services/auth';
import { Books } from '../../services/book';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
templateUrl: './admin.html',
styleUrls: ['./admin.scss'],
})
export class Admin implements OnInit {
  books: Book[] = [];
  users: User[] = [];
  transactions: any[] = [];
  
  bookColumns = ['title', 'author', 'availableCopies', 'actions'];
  userColumns = ['name', 'email', 'role', 'borrowedBooks', 'actions'];
  transactionColumns = ['bookTitle', 'userName', 'borrowDate', 'returnDate', 'status'];

  constructor(
    public authService: Auth,
    private bookService: Books,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadUsers();
    this.loadTransactions();
  }

  loadBooks(): void {
    this.books = this.bookService.getBooks();
  }

  loadUsers(): void {
    this.users = this.authService.getAllUsers();
  }

  loadTransactions(): void {
    this.transactions = this.bookService.getTransactions();
  }

  getBookTitle(bookId: string): string {
    const book = this.books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  }

}