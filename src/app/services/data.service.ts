import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptionsArgs } from '@angular/http';
import * as _ from "lodash";

import { User } from '../models/user';
import { VehicleLocation } from '../models/vehicle-location';
import { StorageData } from '../models/storage-data';

@Injectable()
export class DataService {
    private getUsersUrl = 'http://mobi.connectedcar360.net/api/?op=list';
    private getVehicleLocationsUrl = 'http://mobi.connectedcar360.net/api/?op=getlocations&userid=';
    private usersTimeout = 5 * 60;
    private vehicleLocationsTimeout = 30;

    private localStorage: any;

    constructor(private http: Http) {
        this.localStorage = window.localStorage;
    }

    getUsers(): Observable<User[]> {
        if (!_.isNil(this.localStorage)) {
            var localData = this.getDataFromLocalStorage<User[]>('users');

            if (!_.isNil(localData) && !localData.isExpired(this.usersTimeout)) {
                return Observable.of<User[]>(localData.data);
            }
        }

        return this.getUsersRemotely();
    }

    getAddress(lat: number, lon: number) {
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}`)
            .map(this.extractData);
    }

    getVehicleLocations(userid: number): Observable<VehicleLocation[]> {
        if (!_.isNil(this.localStorage)) {
            var localData = this.getDataFromLocalStorage<VehicleLocation[]>(`vehicleLocations_${userid}`);

            if (!_.isNil(localData) && !localData.isExpired(this.vehicleLocationsTimeout)) {
                return Observable.of<VehicleLocation[]>(localData.data);
            }
        }

        return this.getVehicleLocationsRemotely(userid);
    }

    private getUsersRemotely(): Observable<User[]> {
        let options = this.getRequestOptions();

        return this.http.get(this.getUsersUrl, options)
            .catch(this.handleError)
            .map(this.extractData)
            .do(data => this.setDataToLocalStorage('users', data));
    }

    private getVehicleLocationsRemotely(userid: number): Observable<VehicleLocation[]> {
        let options = this.getRequestOptions();

        return this.http.get(`${this.getVehicleLocationsUrl}${userid}`, options)
            .catch(this.handleError)
            .map(this.extractData)
            .do(data => this.setDataToLocalStorage(`vehicleLocations_${userid}`, data));
    }

    private getRequestOptions(): RequestOptionsArgs {
        let options = {
            search: new URLSearchParams()
        };
        options.search.set('timestamp', (new Date()).getTime().toString());

        return options;
    }

    private extractData(res: Response): any {
        let body = res.json();
        return body.data || body.results || {};
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    private setDataToLocalStorage<T>(name: string, data: any): void {
        this.localStorage.setItem(name, JSON.stringify(new StorageData<T>(new Date(), data)));
    }

    private getDataFromLocalStorage<T>(name: string): StorageData<T> {
        var data = this.localStorage.getItem(name);

        if (!_.isNil(data)) {
            var rawLocalData = JSON.parse(data)
            return new StorageData<T>(rawLocalData.modifiedAt, rawLocalData.data);
        }
        return null;
    }
}