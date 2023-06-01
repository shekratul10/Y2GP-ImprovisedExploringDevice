import { Time } from '@angular/common';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {

  constructor() { }

  private _text:ConsoleEntry[] = [];
  public get text(){
    return this._text;
  }
  private set text(t){
    this._text = t;
  }

  public ConsoleEvent:EventEmitter<ConsoleEntry> = new EventEmitter<ConsoleEntry>();

  log(input:string){
    let c:ConsoleEntry = {timestamp:new Date(Date.now()), message:input, level:"log"};
    this.text.push(c);
    this.ConsoleEvent.emit(c);
  }
  warn(input:string){
    let c:ConsoleEntry = {timestamp:new Date(Date.now()), message:input, level:"warn"};
    this.text.push(c);
    this.ConsoleEvent.emit(c);
  }
  error(input:string){
    let c:ConsoleEntry = {timestamp:new Date(Date.now()), message:input, level:"error"};
    this.text.push(c);
    this.ConsoleEvent.emit(c);
  }
  fatal(input:string){
    let c:ConsoleEntry = {timestamp:new Date(Date.now()), message:input, level:"fatal"};
    this.text.push(c);
    this.ConsoleEvent.emit(c);
  }

  clear(){
    this.text = [];
  }

}

export interface ConsoleEntry{
  timestamp: Date;
  message: string;
  level: "log"|"warn"|"error"|"fatal";
}