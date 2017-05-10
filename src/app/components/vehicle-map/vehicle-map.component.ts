import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { DataService } from '../../services/data.service';
import { EventsService } from '../../services/events.service';
import { VehicleMapMarker } from '../../models/vehicle-map-marker';
import { VehicleLocation } from '../../models/vehicle-location';
import { Vehicle } from '../../models/vehicle';
import { User } from '../../models/user';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

@Component({
    selector: 'vehicle-map',
    templateUrl: './vehicle-map.component.html',
    styleUrls: ['./vehicle-map.component.css']
})
export class VehicleMapComponent implements OnChanges {
    zoom: number = 10;
    lat: number;
    lng: number;
    markers: VehicleMapMarker[];
    currentIntervalId: any;

    @Input()
    user: User;

    @Input() selectedVehicle: Vehicle;
    @Output() selectedVehicleChange = new EventEmitter<Vehicle>();

    constructor(private eventsService: EventsService, private dataService: DataService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        var userValues = changes.user;
        if (!_.isNil(userValues) && !_.isNil(userValues.currentValue)) {
            var user = <User>userValues.currentValue;

            if (!_.isNil(this.currentIntervalId)) {
                clearInterval(this.currentIntervalId);
            }
            this.currentIntervalId = setInterval(() => {
                this.updateLocations(this.user);
            }, 60*1000);

            this.updateLocations(this.user);
        }

        var selectedVehicleValues = changes.selectedVehicle;
        if (!_.isNil(selectedVehicleValues) && !_.isNil(selectedVehicleValues.currentValue)) {
            var selectedVehicle = selectedVehicleValues.currentValue;

            _.forEach(this.markers, (marker) => {
                var isSelected = marker.vehicleid === selectedVehicle.vehicleid;
                marker.isOpened = isSelected;

                if (isSelected) {
                    this.lat = marker.lat;
                    this.lng = marker.lng;
                }
            });
        }

    }

    onMarkerClick(label: string, index: number) {
        var marker = this.markers[index];
        this.dataService.getAddress(marker.lat, marker.lng).subscribe(
            data => {
                marker.address = !_.isNil(data) && data.length > 0 ? data[0].formatted_address : '';
                marker.isOpened = true;
                this.selectedVehicleChange.emit(marker.vehicle);
            },
            (error) => {
                this.eventsService.errorEvent.emit("Something went wrong. Can't load vehicle address.");
            });
    }

    updateLocations(user: User): void{
        this.dataService.getVehicleLocations(user.userid).subscribe(
            data => {
                var locations = data;
                if (!_.isNil(locations) && !_.isNil(locations)) {
                    this.markers = _.map(locations, (location) => {
                        var vehicle = _.find(user.vehicles, (v) => {
                            return v.vehicleid === location.vehicleid;
                        });
                        return new VehicleMapMarker(<VehicleLocation>location, vehicle);
                    });
                    if (!_.isNil(this.markers) && this.markers.length > 0) {
                        this.lat = this.markers[0].lat;
                        this.lng = this.markers[0].lng;
                    } else {
                        this.lat = 53.902209;
                        this.lng = 27.561840;
                    }
                }
            },
            (error) => {
                this.eventsService.errorEvent.emit("Something went wrong. Can't load vehicle locations.");
            });
    }
}