import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EventsService {
    errorEvent = new EventEmitter<string>();
}