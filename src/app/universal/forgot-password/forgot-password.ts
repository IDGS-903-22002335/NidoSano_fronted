import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, MatIconModule, MatSnackBarModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
 email!: string;
 authService = inject(Auth)
  matSnackbar = inject(MatSnackBar);
  showEmailSent = false;
  isSubmitting = false;

    forgetPassword() {
    this.isSubmitting = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.matSnackbar.open(response.message, 'Close', {
            duration: 5000,
          });
          this.showEmailSent = true;
        } else {
          this.matSnackbar.open(response.message, 'Close', {
            duration: 5000,
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        this.matSnackbar.open(error.message, 'Close', {
          duration: 5000,
        });
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

}
