import { Component } from '@angular/core';
import { Footer } from "../footer/footer";
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  imports: [Footer],
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class View {
  constructor(private router: Router) { }

  solicitarInformacion() {
    this.router.navigate(['/estimate']);
  }

}
