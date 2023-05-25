import { Component, OnInit } from '@angular/core';
import { RoverDataService, Telemetry } from '../rover-data.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  constructor(private roverData:RoverDataService) { }
   
  state: Telemetry["state"] = "stop";
  stateDisplay = "";

  ngOnInit(): void {
    this.roverData.telemetryUpdate.subscribe(this.updateDisplay())
  }

  updateDisplay(){
    this.state = this.roverData.getTelemetry().state;
    switch(this.state){
      case "stop": 
        this.stateDisplay = "START";
        break;
      default:
        this.stateDisplay = "STOP";
        break;
      
    }
  }

  btnClick(){
    if(this.state == "stop"){
      this.roverData.sendCommand("start");
    }
    else{
      this.roverData.sendCommand("stop");
    }
  }

}
