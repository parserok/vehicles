import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../services/data.service';
import { EventsService } from '../../services/events.service';
import { User } from '../../models/user';
import { Vehicle } from '../../models/vehicle';
import * as _ from "lodash";

@Component({
    selector: 'user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
    userList: User[];
    selectedUser: User;
    selectedVehicle: Vehicle;

    constructor(private route: ActivatedRoute, private router: Router, private eventsService: EventsService, private dataService: DataService) {
    }

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => {
                return this.dataService.getUser(+params['id'])
            })
            .subscribe((user) => {
                this.selectedUser = user;
            },
            (error) => {
                this.eventsService.errorEvent.emit("Something went wrong. Can't load users.");
            });
    }

    onSelectVehicle(vehicle: Vehicle): void {
        this.selectedVehicle = vehicle;
    }
}