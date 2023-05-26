import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TelemetryComponent } from './telemetry/telemetry.component';
import { MapComponent } from './map/map.component';
import {HttpClientModule} from '@angular/common/http';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatCardModule} from '@angular/material/card'
import { FrontpageComponent } from './frontpage/frontpage.component';
import { MenubarComponent } from './menubar/menubar.component';
import { ConsoleComponent } from './console/console.component';

const routes: Routes = [
  {path:'', component:FrontpageComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'console', component:ConsoleComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TelemetryComponent,
    MapComponent,
    ControlPanelComponent,
    FrontpageComponent,
    MenubarComponent,
    ConsoleComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatGridListModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatCardModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
