export interface ComponentLotDetailDto {
  idComponentLot: string;
  componentId: string;
  componentName: string;
  supplierId: string;
  supplierName: string;
  unitPrice: number;
  amount: number;
  availableQuantity: number;
}

export interface BuysDetailDto {
  idBuys: string;
  adminId: string;
  adminFullName: string;
  dateBuys: Date; 
  total: number;
  componentLots: ComponentLotDetailDto[];
}
