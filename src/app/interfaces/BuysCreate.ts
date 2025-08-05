export interface BuysCreateDto {
  adminId: string;
  componentLots: {
    componentId: string;
    supplierId: string;
    unitPrice: number;
    amount: number;
  }[];
}
