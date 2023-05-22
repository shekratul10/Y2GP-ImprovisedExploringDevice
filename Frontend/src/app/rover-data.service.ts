import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoverDataService {

  constructor(private http:HttpClient) { }

  // Local telemetry store
  private telemetry:Telemetry = {pos:{x:0,y:0},angle:0,speed:0};
  LoS:boolean = true;
  auth_code:number = 0;

  // Auto update boolean to be enabled or disabled from the interface
  private _autoUpdate:boolean = false;
  public get autoUpdate(){
    return this._autoUpdate;
  }
  public set autoUpdate(val:Boolean){
    // Sets a timeout for the function at the refresh time
    if(val) this.updateTimeout = setTimeout(this.updateTelemetry, this.updateRefreshTime);
    // Clear the timeout if disabling
    else clearTimeout(this.updateTimeout);
  }
  // This stupid bit is to convince TypeScript that I am allowed to have an undefined timeout.
  private updateTimeout:NodeJS.Timeout = undefined as unknown as NodeJS.Timeout;
  private updateRefreshTime:number = 250;


  public getTelemetry(){
    return this.telemetry;
  }

  //Public facing event to trigger a refresh every time the telemetry changes
  public telemetryUpdate = new EventEmitter();

  private getTelemetryFromServer(){
    return this.http.post<Telemetry>(`{environment.apiBaseUrl}/api/telemetry`,this.auth_code)
  }

  private updateTelemetry(){
    this.getTelemetryFromServer()
      .subscribe((data:Telemetry) => {
        this.telemetry = data; 
        this.telemetryUpdate.emit()
      })
  }

}

export type Position = {
  x:number;
  y:number;
}

export interface Telemetry{
  pos:Position;
  angle:number;
  speed:number;
  
}