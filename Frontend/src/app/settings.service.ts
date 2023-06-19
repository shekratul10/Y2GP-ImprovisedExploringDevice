import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  private _settings: Settings = {roverId:0, refreshRate: 200, beaconPositions: [{ beaconColour: "red", x: 0, y: 0 }, { beaconColour: "blue", x: 0, y: 0 }, { beaconColour: "orange", x: 0, y: 0 }] }
  public get settings(): Settings {
    return this._settings;
  }
  public set settings(value: Settings) {
    this._settings = value;
    this.settingsChanged.emit(value);
  }

  public settingsChanged: EventEmitter<Settings> = new EventEmitter<Settings>();

}

export interface Settings {
  roverId:number;
  refreshRate: number;
  beaconPositions: BeaconPosition[];
}

export type BeaconPosition = {

  beaconColour: string;
  x: number;
  y: number;
}