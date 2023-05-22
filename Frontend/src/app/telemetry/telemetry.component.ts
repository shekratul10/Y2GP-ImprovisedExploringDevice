import { Component, OnInit } from '@angular/core';
import { RoverDataService, Telemetry } from '../rover-data.service';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss']
})
export class TelemetryComponent implements OnInit {

  constructor(public dataService:RoverDataService) { }

  telemetry:Telemetry = this.dataService.getTelemetry();

  ngOnInit(): void {
    this.dataService.telemetryUpdate.subscribe(() => this.updateTelemetry())
  }

  updateTelemetry(){
    this.telemetry = this.dataService.getTelemetry();
  }

}
