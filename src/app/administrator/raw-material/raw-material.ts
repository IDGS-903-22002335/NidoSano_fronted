import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { component } from '../../interfaces/component';
import { Admin } from '../../services/admin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Loss } from '../../interfaces/componentLoss';
import { componentLot } from '../../interfaces/componentLotGet';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-raw-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './raw-material.html',
  styleUrl: './raw-material.css'
})
export class RawMaterial implements OnInit {
  components: component[] = [];
  componentForm: FormGroup;
  showRegisterForm = false; 
  searchTerm: string = '';
  lossForm: FormGroup;
showLossModal: boolean = false;
selectedComponentLotId: string | null = null;
componentLots: componentLot[] = [];

filteredComponents: component[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: Admin,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.componentForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
    
    });
  this.lossForm = this.fb.group({
  componentLotId: ['', Validators.required],
  amount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
  type: ['', Validators.required],
});


  }

  ngOnInit(): void {
    this.loadComponents();
     this.loadComponentLots();
  }

  loadComponentLots(): void {
  this.adminService.getComponentLot().subscribe({
    next: (res) => {
      this.componentLots = res;
      console.log('Lotes cargados:', res);
    },
    error: (err) => {
      console.error('Error al cargar lotes', err);
    }
  });
}
loadComponents(): void {
  this.adminService.getComponent().subscribe({
    next: (res) => {
      this.components = res;
      this.filteredComponents = res; // inicializa con todos
      console.log('Componentes cargados:', res);
    },
    error: (err) => {
      console.error('Error al cargar componentes', err);
    }
  });
}



filterComponents(): void {
  const term = this.searchTerm.toLowerCase();
  this.filteredComponents = this.components.filter(comp =>
    comp.name.toLowerCase().includes(term) ||
    comp.category.toLowerCase().includes(term) ||
    (comp.description?.toLowerCase().includes(term) ?? false)
  );
}

   toggleRegisterForm() {
    this.showRegisterForm = !this.showRegisterForm;
  }

  onSubmit() {
    if (this.componentForm.valid) {
      const newComponent: component = this.componentForm.value;
      this.adminService.registerComponent(newComponent).subscribe({
        next: () => {
          this.snackBar.open('Componente registrado correctamente', 'Cerrar', { duration: 3000 });
          this.componentForm.reset();
          this.loadComponents();
          this.showRegisterForm = false; // cerrar modal después de guardar
        },
        error: () => {
          this.snackBar.open('Error al registrar componente', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }


openLossModal() {
  this.showLossModal = true;
}


closeLossModal() {
  this.lossForm.reset();
  this.showLossModal = false;
}

submitLoss() {
  if (this.lossForm.valid) {
    const lossData: Loss = {
      idComponentLot: this.lossForm.value.componentLotId, 
      amount: this.lossForm.value.amount,
      type: this.lossForm.value.type
    };

    this.adminService.RegisterLoss(lossData).subscribe({
      next: () => {
        this.snackBar.open('Pérdida registrada correctamente', 'Cerrar', { duration: 3000 });
        this.closeLossModal();
        this.loadComponents();
        this.loadComponentLots(); 
      },
      error: () => {
        this.snackBar.open('Error al registrar la pérdida', 'Cerrar', { duration: 3000 });
      }
    });
  }
}


}
