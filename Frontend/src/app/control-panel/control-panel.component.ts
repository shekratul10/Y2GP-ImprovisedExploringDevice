import { Component, OnInit } from '@angular/core';
import { RoverDataService, Telemetry } from '../rover-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsoleService } from '../console.service';
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {
  


  constructor(public roverData:RoverDataService, private _snackBar:MatSnackBar, private logger:ConsoleService) { }
   
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
      this.logger.log("START SIGNAL SENT");
    }
    else{
      this.roverData.sendCommand("stop");
      let InfoSnackBar = this._snackBar.open("STOP SIGNAL SENT", "OK");
      this.logger.log("STOP SIGNAL SENT");
    }
  }



}
