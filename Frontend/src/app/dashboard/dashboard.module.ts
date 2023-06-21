import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatCardModule } from '@angular/material/card';
import { RoverViewportComponent } from '../rover-viewport/rover-viewport.component';
import { ControlPanelComponent } from '../control-panel/control-panel.component';
import { TelemetryComponent } from '../telemetry/telemetry.component';
import { MapComponent } from '../map/map.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatIconModule} from '@angular/material/icon'

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    RoverViewportComponent,
    ControlPanelComponent,
    TelemetryComponent,
    MapComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    MatIconModule
  ]
})
export class DashboardModule { }
