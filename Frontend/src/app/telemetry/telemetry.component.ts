import { Component, OnInit } from '@angular/core';
import { RoverDataService, Telemetry } from '../rover-data.service';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.scss']
})
export class TelemetryComponent implements OnInit {

  constructor(public roverData:RoverDataService) { }

  telemetry:Telemetry = this.roverData.getTelemetry();

  ngOnInit(): void {
    //Subscribe to the event emitter to update the telemetry display
    this.roverData.telemetryUpdate.subscribe(() => this.updateTelemetry())
  }

  updateTelemetry(){
    this.telemetry = this.roverData.getTelemetry();
  }

}
