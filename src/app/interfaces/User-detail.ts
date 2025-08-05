import { startWith } from 'rxjs/operators';
export interface UserDetail {
  id: string;
  fullName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  roles: string[];
  phoneNumber: string;
  twoFacotrEnabled: true;
  phoneNumberConfirmed: true;
  accessFailedCount: 0;
  status: number;
}