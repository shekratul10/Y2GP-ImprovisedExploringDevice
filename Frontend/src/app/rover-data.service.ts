import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoverDataService {

  constructor(private http:HttpClient) { }

  // Local telemetry and map store
  private telemetry:Telemetry = {id:0,pos:{x:0,y:0},tilt:[],speed:0, state:"stop"};
  private map: RoverMap = {
    map: [
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ]
  }; //TODO: Remove the test data
  
  
//LoS is loss of signal, to be set if there is either a server timeout or data is too old
  LoS:boolean = true;
  auth_token:string = "";

  // Auto update boolean to be enabled or disabled from the interface
  private _autoUpdate:boolean = false;
  public get autoUpdate(){
    return this._autoUpdate;
  }
  public set autoUpdate(val:Boolean){
    // Sets a timeout for the function at the refresh time
    if(val) this.updateTimeout = setTimeout(this.updateData, this.updateRefreshTime);
    // Clear the timeout if disabling
    else clearTimeout(this.updateTimeout);
  }
  // This stupid bit is to convince TypeScript that I am allowed to have an undefined timeout.
  private updateTimeout:NodeJS.Timeout = undefined as unknown as NodeJS.Timeout;
  private updateRefreshTime:number = 250;

  public getTelemetry(){
    return this.telemetry;
  }

  public getMap(){
    return this.map;
  }

  //Public facing event to trigger a refresh on the DOM every time the telemetry or map changes
  public telemetryUpdate = new EventEmitter();
  public roverMapUpdate = new EventEmitter();

  private getTelemetryFromServer(){
    return this.http.get<Telemetry>(`${environment.apiBaseUrl}/api/telemetry`);//{params:{auth_code:this.auth_token}})
  }

  private getRoverMapFromServer(){
    return this.http.get<RoverMap>(`${environment.apiBaseUrl}/api/map`);//,{params:{auth_code:this.auth_token}})
  }

  public sendCommand(com:Command){
    this.http.post(`${environment.apiBaseUrl}/api/cmd`, com);//,{params:{auth_code:this.auth_token}});
  }

  //TODO: Might separate these into independent auto updaters
  private updateData(){
    this.getTelemetryFromServer()
      .subscribe((data:Telemetry) => {
        this.telemetry = data; 
        this.telemetryUpdate.emit()
      });
    this.getRoverMapFromServer()
      .subscribe((data:RoverMap) => {
        this.map = data;
        this.roverMapUpdate.emit()
      });
  }
}


//TODO: Figure out an actual data type for the map (probably a 2d array)
export type RoverMap = {
  map:number[][];
}

export type Position = {
  x:number;
  y:number;
}

export type Command = "start" | "stop";

export interface Telemetry{
  id:number;
  tilt:number[];
  pos:Position;
  speed:number;
  state:"start"|"stop"|"mapping"|"solving"|"error" //TODO: make this useful
}