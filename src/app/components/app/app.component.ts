import { Component } from '@angular/core';
import { EventsService } from '../../services/events.service';
import { MdSnackBar } from '@angular/material';

@Component({
    selector: 'vehicles-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor(private eventsService: EventsService, private snackBar: MdSnackBar) {
        this.eventsService.errorEvent.subscribe((error: string) => {
            snackBar.open(error, '', {
                duration: 150000,
                extraClasses: ['error']
            });
        });
    }
}