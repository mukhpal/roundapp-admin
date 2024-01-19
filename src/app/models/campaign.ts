import {Producer} from './producer';
import {Video} from './video';

export interface Campaign {
  id?: number;
  title: string;
  description: string;
  tags: number[];
  age: string;
  gender: string;
  paymentType: string;
  people: number;
  geolocation: string;
  budget: number;
  reward?: number;
  video: Video;
  producer: Producer;
}
