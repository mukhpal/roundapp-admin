import {User} from './user';

export interface Advertiser {
  id?: number;
  user: User;
  type: string;
}
