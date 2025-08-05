export interface UserDetailDtoID {
  id: string;
  email: string;
  fullName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  accessFailedCount: number;
  roles: string[];
}
