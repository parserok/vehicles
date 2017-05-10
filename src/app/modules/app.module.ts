import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DataService } from '../services/data.service';
import { EventsService } from '../services/events.service';
import { AppComponent } from '../components/app/app.component';
import { UsersComponent } from '../components/users/users.component';
import { UserDetailsComponent } from '../components/user-details/user-details.component';
import { VehicleMapComponent } from '../components/vehicle-map/vehicle-map.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailsComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    data: { title: 'User List' }
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule.forRoot(),
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC7ptO6ub6eToiHZmzRSr8fLeoG9PPloVg'
    }),
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppComponent,
    UsersComponent,
    UserDetailsComponent,
    VehicleMapComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    DataService,
    EventsService
  ]
})
export class AppModule {
}