import { Component, OnInit } from '@angular/core';
import { RoverDataService, Telemetry } from '../rover-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  constructor(private roverData:RoverDataService, private _snackBar:MatSnackBar) { }
   
  state: Telemetry["state"] = "stop";
  stateDisplay = "";

  ngOnInit(): void {
    this.roverData.telemetryUpdate.subscribe(this.updateDisplay());
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
      let InfoSnackBar = this._snackBar.open("START SIGNAL SENT", "OK");
    }
    else{
      this.roverData.sendCommand("stop");
      let InfoSnackBar = this._snackBar.open("START SIGNAL SENT", "OK");
    }
  }

}
