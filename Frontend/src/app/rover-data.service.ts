import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConsoleService } from './console.service';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class RoverDataService {

  constructor(private http:HttpClient, private consoleService:ConsoleService, private settingsServe:SettingsService) { 
    // Subscribe to the settings service to update the refresh rate
    this.settingsServe.settingsChanged.subscribe((settings) => {
      consoleService.log("Refresh rate changed to " + settings.refreshRate + "ms");
      consoleService.log("Rover ID Changed to " + settings.roverId);
      // If auto update is enabled, clear the timeout and set a new one
      if(this.autoUpdate){
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setInterval(this.updateData.bind(this), settings.refreshRate);
        
      }
    });
  }

  // Local telemetry and map store
  private telemetry:Telemetry = { id:-1,
                                  position:{x:0,y:0},
                                  angle:0,
                                  accelerometer:{x:0,y:0,z:0},
                                  gyroscope:{x:0,y:0,z:0},
                                  steps:0,
                                  state:"stop"};

  private map: RoverMap = {id:-1,nodes:[],edges:[]}; //TODO: Remove the test data
  
  
//LoS is loss of signal, to be set if there is either a server timeout or data is too old
  LoS:boolean = true;
  auth_token:string = "";

  // Auto update boolean to be enabled or disabled from the interface
  private _autoUpdate:boolean = false;
  public get autoUpdate(){
    return this._autoUpdate;
  }
  public set autoUpdate(val:boolean){
    // Sets a timeout for the function at the refresh time
    this._autoUpdate=val;
    if(val) this.updateTimeout = setInterval(this.updateData.bind(this), this.settingsServe.settings.refreshRate);
    // Clear the timeout if disabling
    else clearTimeout(this.updateTimeout);
  }
  // This stupid bit is to convince TypeScript that I am allowed to have an undefined timeout.
  private updateTimeout:NodeJS.Timer = undefined as unknown as NodeJS.Timer;

  public getTelemetry(){
    return this.telemetry;
  }

  public forceUpdate(){
    this.updateData();
  }

  public getMap(){
    return this.map;
  }

  //Public facing event to trigger a refresh on the DOM every time the telemetry or map changes
  public telemetryUpdate = new EventEmitter();
  public roverMapUpdate = new EventEmitter();

  private getTelemetryFromServer(){
    return this.http.get<Telemetry>(`${environment.apiBaseUrl}/api/telemetry`,{params:{id:this.settingsServe.settings.roverId}});
  }

  private getRoverMapFromServer(){
    return this.http.get<RoverMap>(`${environment.apiBaseUrl}/api/map` ,{params:{id:this.settingsServe.settings.mapId}});
  }

  public sendCommand(com:Command){
    this.http.post(`${environment.apiBaseUrl}/api/cmd`, {state:com});
  }

  //TODO: Might separate these into independent auto updaters
  private updateData(){
    this.getTelemetryFromServer().pipe(catchError(this.errorHandler.bind(this)))
      .subscribe((data:Telemetry) => {
        this.telemetry = data; 
        this.LoS=false;
        this.telemetryUpdate.emit()
      });
    this.getRoverMapFromServer()
      .subscribe((data:RoverMap) => {
        this.map = data;
        this.roverMapUpdate.emit()
      });
  }

  private errorHandler(error: HttpErrorResponse) {
    if(error.status === 0){
      this.consoleService.error(error.error);
    }
    else{
      this.consoleService.error(`Backend error ${error.status}: ${error.error}`)
      this.LoS=true;
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}


//TODO: Figure out an actual data type for the map (probably a 2d array)
export type RoverMap = {
  id:number;
  edges:MapEdge[];
  nodes:MapNode[];
}

export type MapEdge = {
  id:number;
  source:number;
  target:number;
  weight:number;
}

export type MapNode = {
  id:number;
  position:Position;
}

export type Position = {
  x:number;
  y:number;
}

export type xyzValue = {
  x:number;
  y:number;
  z:number;
}

export type Command = "start" | "stop";

export interface Telemetry{
  id:number;
  position:Position;
  angle:number;
  accelerometer:xyzValue;
  gyroscope:xyzValue;
  steps:number,
  state:"start"|"stop"|"mapping"|"solving"|"error" //TODO: make this useful
}