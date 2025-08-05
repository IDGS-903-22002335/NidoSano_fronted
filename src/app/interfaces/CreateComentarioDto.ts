export interface CreateComentarioDto {
  Text: string;
  ClientId?: string;
  AdministratorId?: string;
  ChickenCoopId?: string;
  ParentMessageId?: string;
  TypeMessage: number; 
}