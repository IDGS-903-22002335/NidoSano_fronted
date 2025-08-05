import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopSellingProduct } from '../interfaces/dashboard';
import { userDelete } from '../interfaces/userDelete';
import { UpdateUserDto } from '../interfaces/UpdateUserDto';
import { UserDetailDtoID } from '../interfaces/UserDetailId';
import { CreateComentarioDto } from '../interfaces/CreateComentarioDto';
import { SupplierDto } from '../interfaces/Supplier';
import { delteSuppier } from '../interfaces/DeleteSupplier';
import { UpdateSupplier } from '../administrator/update-supplier/update-supplier';
import { Supplier } from '../administrator/supplier/supplier';
import { component } from '../interfaces/component';
import { componentLot } from '../interfaces/componentLotGet';
import { Loss } from '../interfaces/componentLoss';
import { BuysCreateDto } from '../interfaces/BuysCreate';
import { BuysDetailDto } from '../interfaces/BuysDetail';
import { constingDto } from '../interfaces/Costing';
import { ChickenCoopCreateDto } from '../interfaces/ChickenCoopCreateDto';
import { ChickenCoopWithRecipesDto } from '../interfaces/ChickenCoopWithRecipesDto';
import { ProductionLotCreateDto } from '../interfaces/ProductionLotCreateDto';
import { ProductionDto } from '../interfaces/ProductionDto';
import { UpdateSaleDto } from '../interfaces/UpdateSaleDto';
import { UpdateSaleStatusDto } from '../interfaces/UpdateSaleStatusDto';



@Injectable({
  providedIn: 'root'
})
export class Admin {
    apiUrl = environment.apiUrl;
    
    constructor(private http:HttpClient){}



  // metodo para el dashboard
     getDashboard(startDate: Date, endDate: Date): Observable<TopSellingProduct[]> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<TopSellingProduct[]>(`${this.apiUrl}Dashboard/top-products`, { params });
  }

// metodos para el elimar y actualizar el usuario
  deleteUser(user: userDelete): Observable<any> {
  return this.http.put(`${this.apiUrl}Account/delete`, user);
}

updateUser(user:UpdateUserDto): Observable<any>{
  return this.http.put(`${this.apiUrl}Account/update`, user);
}

getUserDetailById(id: string): Observable<UserDetailDtoID> {
  return this.http.get<any>(`${this.apiUrl}Account/userdetail/${id}`);
}


// metodo para Comentario, preguntas y repuestas
getPreguntasYComentariosPendientes(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}Message/PreguntasyComentariosPendientes`);
}

createMessage(dto: CreateComentarioDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Message/Create`, dto);
  }

// Proveedor

createSupplier(supplier: SupplierDto): Observable<any>{
 return this.http.post<any>(`${this.apiUrl}Supplier/registerSupplier`, supplier)
}

getSupplier(): Observable<SupplierDto[]>{
  return this.http.get<SupplierDto[]>(`${this.apiUrl}Supplier/getActiveSuppliers`)
}

deleteSupplier(supplier: delteSuppier): Observable<any>{
  return this.http.put(`${this.apiUrl}Supplier/deleteSupplier`, supplier)

}

UpdateSupplier(Supplier: SupplierDto): Observable<any>{
  return this.http.put<any>(`${this.apiUrl}Supplier/updateSupplier`, Supplier)
}

getSupplierById(id: string): Observable<SupplierDto>{
   return this.http.get<SupplierDto>(`${this.apiUrl}Supplier/getSupplierById/${id}`)
}

// Materia prima
registerComponent(component: component): Observable<any>{
  return this.http.post<any>(`${this.apiUrl}Component/RegisterComponent`, component)
}

getComponent(): Observable<component[]>{
  return this.http.get<component[]>(`${this.apiUrl}Component/GetComponentsLotWithAvailableQuantity`)
}


// Lote de materia prima y merma
getComponentLot(): Observable<componentLot[]>{
  return this.http.get<componentLot[]>(`${this.apiUrl}Component/GetComponentLotQuantities`)
}

RegisterLoss(loss: Loss): Observable<any>{
  return this.http.post<any>(`${this.apiUrl}Component/RegisterLoss`, loss)
}
// compra a proveedores
BuysRegister(buy: BuysCreateDto): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}Buys/BuysRegister`, buy);
}

getAllBuysWithDetails(): Observable<BuysDetailDto[]> {
  return this.http.get<BuysDetailDto[]>(`${this.apiUrl}Buys/GetAllWithDetails`);
}

// costeo de componentes
getCosting(): Observable<constingDto[]>{
  return this.http.get<constingDto[]>(`${this.apiUrl}ComponentCosting/GetAllCostings`)
}


getCostingByName(componentName: string): Observable<constingDto[]>{
  return this.http.get<constingDto[]>(`${this.apiUrl}ComponentCosting/GetCostingsByComponentName/${componentName}`)
}

// explocion de materia prima
createChickenCoopWithRecipe(dto: ChickenCoopCreateDto): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}Product/CreateChickenCoopWithRecipe`, dto );
}


getChickenCoopsWithRecipes(): Observable<ChickenCoopWithRecipesDto[]> {
  return this.http.get<ChickenCoopWithRecipesDto[]>(`${this.apiUrl}Product/GetChickenCoopWithRecipes`);
}

getAllBasic(): Observable<any[]>{
  return this.http.get<any[]>(`${this.apiUrl}Product/GetAllBasic`)
}

// produccion 
registerMultipleProductionLots(lotes: ProductionLotCreateDto[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}Production/RegisterMultiple`, lotes);
}

getProduction(): Observable<ProductionDto>{
 return this.http.get<ProductionDto>(`${this.apiUrl}Production/GetAllAvailableProducts`)
}

changeProductionStatus(id: string, newStatus: string): Observable<any> {
  const params = new HttpParams().set('newStatus', newStatus);
  return this.http.put(`${this.apiUrl}Production/ChangeStatus/${id}`, {}, { params });
}

getAllProductRequested(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}Production/GetAllproductRequested`);
}


// ventas
getSalesWithDetails(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}Sales/GetSalesWithDetails`);
}

getSaleWithDetailsById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}Sales/GetSaleWithDetailsById/${id}`);
}

updateSaleWithChickenCoop(dto: UpdateSaleDto): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}Sales/UpdateSaleWithChickenCoop`, dto);
}

changeSaleStatus(dto: UpdateSaleStatusDto): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}Sales/ChangeSaleStatus`, dto);
}

// Posible Cliente
getPossibleClient(): Observable<any>{
  return this.http.get<any>(`${this.apiUrl}PossibleClient/getAllPossibleClient`)
}
getPossibleClientById(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}PossibleClient/getPossibleClientById/${id}`);
}

}
