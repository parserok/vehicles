import { VehicleLocation } from './vehicle-location';
import { Vehicle } from './vehicle';

export class VehicleMapMarker {
    constructor(location: VehicleLocation, vehicle: Vehicle) {
        this.vehicleid = location.vehicleid;
        this.lat = location.lat;
        this.lng = location.lon;
        this.isOpened = false;
        this.label = location.vehicleid.toString();
        this.vehicle = vehicle;
    }

    vehicleid: number;
    lat: number;
    lng: number;
    label?: string;
    isOpened: boolean;
    address: string;
    vehicle: Vehicle;
}