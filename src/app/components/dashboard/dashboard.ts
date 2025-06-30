import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Auth } from '../../services/auth';
import { Books } from '../../services/book';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  borrowedBooksCount = 0;

  constructor(
    public authService: Auth,
    private bookService: Books
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.borrowedBooksCount = this.bookService.getUserBorrowedBooks(currentUser.id).length;
      }
    }
  }
}