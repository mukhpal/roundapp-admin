import {PaymentAccount} from './paymentAccount';

export interface User {
  id?: string;
  role: string;
  email: string;
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  name: string;
  verified: boolean;
  created_at: string;
  last_login_at: string;
  last_login_ip: string;
  image: string;
  favouritePaymentAccount: PaymentAccount;
}
