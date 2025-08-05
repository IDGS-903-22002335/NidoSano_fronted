import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { possibleClient } from '../interfaces/createpossibleclient';

@Injectable({
  providedIn: 'root'
})
export class Client {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPurchasedProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}sales/GetPurchasedProducts`);
  }

  getPurchasedProductsByID(saleId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}sales/GetPurchasedProductsById/${saleId}`);
}

// para la estimacion y hacer la compra desde el lado del cliente
generateEstimate(dto: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}sales/GenerateEstimate`, dto);
}

registerSaleFromEstimate(dto: { estimateId: string; cantidadProductos: number }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}sales/RegisterSaleFromEstimate`, dto);
}

previewEstimate(dto: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}sales/PreviewEstimate`, dto);
}

createQualification(dto: { ClientId: string; ChickenCoopId: string; Punctuation: number }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}message/CreateQualification`, dto);
}

getPreguntasConRespuestas(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}message/ComentariosConRespuestas`);
}

getPreguntasConRespuestas2(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}message/PreguntasConRespuestas`);
}

getResumenCalificaciones(chickenCoopId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}message/ResumenCalificaciones/${chickenCoopId}`);
}

createPossibleClient(client: possibleClient): Observable<any>{
  return this.http.post<any>(`${this.apiUrl}PossibleClient/PossibleClientRegister`, client)
}

}
