import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  constructor(private router: Router) { }

  verResenias(){
    this.router.navigate(['/Product_view']);
  }

  verInicio(){
    this.router.navigate(['/']);
  }

  verNidoSano(){
    this.router.navigate(['/nidosano']);
  }

  verSobreNosotros(){
    this.router.navigate(['/about_us']);
  }

  verCotizacion(){
    this.router.navigate(['/estimate']);
  }
}
