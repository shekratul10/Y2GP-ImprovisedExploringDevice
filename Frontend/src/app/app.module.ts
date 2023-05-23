import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TelemetryComponent } from './telemetry/telemetry.component';
import { MapComponent } from './map/map.component';
import {HttpClientModule} from '@angular/common/http'

const routes: Routes = [
  {path:'', component:DashboardComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TelemetryComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
