import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-nidosano',
  imports: [Footer],
  templateUrl: './nidosano.html',
  styleUrl: './nidosano.css'
})
export class Nidosano {
  constructor(private router: Router) { }

  solicitarInformacion() {
    this.router.navigate(['/estimate']);
  }

  verResenias(){
    this.router.navigate(['/Product_view']);
  }
}
