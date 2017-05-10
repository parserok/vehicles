import { Owner } from './owner';
import { Vehicle } from './vehicle';

export class User {
    userid: number;
    owner: Owner;
    vehicles: Vehicle[];
}