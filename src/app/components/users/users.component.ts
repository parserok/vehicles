import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { EventsService } from '../../services/events.service';
import { User } from '../../models/user';
import { Vehicle } from '../../models/vehicle';
import * as _ from "lodash";

@Component({
    selector: 'vehicles-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
    userList: User[];

    constructor(private router: Router, private eventsService: EventsService, private dataService: DataService) {
    }

    ngOnInit(): void {
        this.dataService.getUsers()
            .subscribe(
            data => {
                this.userList = _.filter(data, (item) => {
                    return !_.isNil(item) && !_.isNil(item.owner);
                });
            },
            (error) => {
                this.eventsService.errorEvent.emit("Something went wrong. Can't load users.");
            });
    }

    onSelectUser(user: User): void {
        this.router.navigate(['/user', user.userid]);
    }
}