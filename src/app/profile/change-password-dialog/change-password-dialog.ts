import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule,  MatDialogModule],
  templateUrl: './change-password-dialog.html',
  styleUrls: ['./change-password-dialog.scss']
})
export class ChangePasswordDialogComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onChangePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      return;
    }
    // Add password change logic here
    this.dialogRef.close(true);
  }
}