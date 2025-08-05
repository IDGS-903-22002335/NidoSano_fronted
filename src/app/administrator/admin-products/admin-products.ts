import { Component, OnInit } from '@angular/core';
import { Admin } from '../../services/admin';
import { ChickenCoopWithRecipesDto } from '../../interfaces/ChickenCoopWithRecipesDto';
import { ChickenCoopCreateDto } from '../../interfaces/ChickenCoopCreateDto';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { component } from '../../interfaces/component';
@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit {
  chickenCoops: ChickenCoopWithRecipesDto[] = [];
  showModal = false;
  coopForm!: FormGroup;
components: component[] = []; 
  constructor(private adminService: Admin, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadCoops();
    this.loadComponents();
    this.initForm();
  }

 loadCoops() {
    this.adminService.getChickenCoopsWithRecipes().subscribe({
      next: (res) => this.chickenCoops = res,
      error: (err) => console.error('Error al obtener gallineros', err)
    });
  }

  loadComponents() {
    this.adminService.getComponent().subscribe({
      next: (res) => this.components = res,
      error: (err) => console.error('Error al obtener componentes', err)
    });
  }


  initForm() {
    this.coopForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      recipes: this.fb.array([
        this.fb.group({
          description: [''],
          amount: [0],
          details: this.fb.array([
            this.fb.group({
              componentId: [''],
              componentQuantity: [0]
            })
          ])
        })
      ])
    });
  }

  get recipes() {
    return this.coopForm.get('recipes') as FormArray;
  }

  getRecipeDetails(index: number): FormArray {
    return this.recipes.at(index).get('details') as FormArray;
  }

 addRecipe() {
  this.recipes.push(this.fb.group({
    description: [''],
    amount: [0],
    details: this.fb.array([])
  }));
}

addDetail(recipeIndex: number) {
  this.getRecipeDetails(recipeIndex).push(this.fb.group({
    componentId: [''],
    componentQuantity: [0]
  }));
}


submit() {
  const rawValue = this.coopForm.value;

  const cleanedDto: ChickenCoopCreateDto = {
    name: rawValue.name,
    description: rawValue.description,
    recipes: rawValue.recipes.map((r: any) => ({
      description: r.description,
      amount: r.amount,
      details: r.details.map((d: any) => ({
        componentId: d.componentId,
        componentQuantity: d.componentQuantity
      }))
    }))
  };

  this.adminService.createChickenCoopWithRecipe(cleanedDto).subscribe({
    next: () => {
      this.loadCoops();
      this.showModal = false;
      this.initForm();
    },
    error: (err) => console.error('Error al crear gallinero', err)
  });
}

}
