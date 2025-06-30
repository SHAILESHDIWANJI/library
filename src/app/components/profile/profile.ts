import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Auth } from '../../services/auth';
import { Books } from '../../services/book';
import { Book } from '../../models/book.model';
import { User } from '../../models/user.model';
import { EditProfileDialogComponent } from '../../profile/edit-profile-dialog/edit-profile-dialog';
import { ChangePasswordDialogComponent } from '../../profile/change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  user: User | null = null;
  borrowedBooks: Book[] = [];
  isLoading = true;
  selectedTabIndex = 0;

  constructor(
    private authService: Auth,
    private bookService: Books,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.borrowedBooks = this.bookService.getUserBorrowedBooks(this.user.id);
    }
    this.isLoading = false;
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
      data: { ...this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user = this.authService.getCurrentUser(); // Refresh user data
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  openChangePasswordDialog(): void {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px',
      data: { userId: this.user?.id }
    });
  }

  returnBook(bookId: string): void {
    if (this.user) {
      const success = this.bookService.returnBook(bookId, this.user.id);
      if (success) {
        this.snackBar.open('Book returned successfully!', 'Close', { duration: 3000 });
        this.loadUserData(); // Refresh data
      } else {
        this.snackBar.open('Failed to return book. Please try again.', 'Close', { duration: 3000 });
      }
    }
  }

  getDaysRemaining(dueDate: string): number {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDueDateStatus(dueDate: string): string {
    const days = this.getDaysRemaining(dueDate);
    if (days < 0) return 'overdue';
    if (days < 3) return 'warning';
    return 'normal';
  }
}