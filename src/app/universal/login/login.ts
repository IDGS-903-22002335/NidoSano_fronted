import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { Router} from '@angular/router';
import { Auth } from '../../services/auth';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatSnackBarModule,MatIconModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  authService = inject(Auth);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router)
 hide =true;

 form!: FormGroup;
 constructor(private fb: FormBuilder) {}

 
login() {
  this.authService.login(this.form.value).subscribe({
    next: (response) => {
      this.matSnackBar.open(response.message, 'close', {
        duration: 5000,
        horizontalPosition: 'center',
      });

      const user = this.authService.getUserDetail();

      if (user?.roles?.includes('Admin')) {
        this.router.navigate(['/dashboard']); 
      } else if (user?.roles?.includes('Cliente')) {
        this.router.navigate(['/home']); 
      } else {
        this.router.navigate(['/']);
      }
    },
    error: (error) => {
      this.matSnackBar.open(error.error.message, 'close', {
        duration: 5000,
        horizontalPosition: 'center',
      });
    },
  });
}


ngOnInit(): void {
  this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password:['',Validators.required],
  });
}
}
