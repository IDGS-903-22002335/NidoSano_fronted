import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { AsyncPipe } from '@angular/common';
import { Admin } from '../../services/admin'; 
import { userDelete } from '../../interfaces/userDelete';
import { MatSnackBar } from '@angular/material/snack-bar'; 
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  authService = inject(Auth);
  adminService = inject(Admin);
  snackBar = inject(MatSnackBar); 
  searchControl = new FormControl('');

 user$ = this.authService.getAll().pipe(
  map(users =>
    users
      .filter(user => user.status === 1)
      .filter(user => user.roles.includes('Cliente'))

  )
);

// observable filtrado por nombre
filteredUsers$ = combineLatest([
    this.user$,
    this.searchControl.valueChanges.pipe(startWith(''))
  ]).pipe(
    map(([users, search]) => {
  const searchText = (search || '').toLowerCase();
  return users.filter(user =>
    user.fullName.toLowerCase().includes(searchText)
  );
})

    
  );


 onDeleteUser(id: string) {
  const data: userDelete = {
    id: id,
    status: 0
  };

  this.adminService.deleteUser(data).subscribe({
    next: (res) => {
      this.snackBar.open(res.message, 'Cerrar', { duration: 3000 });

      // Vuelve a asignar user$ y filteredUsers$ con los nuevos datos
      const updated$ = this.authService.getAll().pipe(
        map(users =>
          users
            .filter(user => user.status === 1)
            .filter(user => user.roles.includes('Cliente'))
        )
      );

      this.user$ = updated$;
      this.filteredUsers$ = combineLatest([
        this.user$,
        this.searchControl.valueChanges.pipe(startWith(''))
      ]).pipe(
        map(([users, search]) => {
  const searchText = (search || '').toLowerCase();
  return users.filter(user =>
    user.fullName.toLowerCase().includes(searchText)
  );
})
      );
    },
    error: (err) => {
      this.snackBar.open('Error al desactivar el usuario', 'Cerrar', { duration: 3000 }); 
      console.error(err);
    }
  });
}

}
