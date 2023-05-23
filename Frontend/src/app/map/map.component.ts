import { Component, ElementRef, OnInit } from '@angular/core';
import Two from 'two.js'
import { RoverDataService, RoverMap } from '../rover-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private domElement:ElementRef, private roverData:RoverDataService) { }

  RoverMap:RoverMap = {map:[]}; // Internal rover map store

  //Use two.js to render the map
  private two:Two = new Two({
    type:Two.Types.canvas,
    autostart:true,
  }).appendTo(this.domElement.nativeElement);



  ngOnInit(): void {
    this.roverData.roverMapUpdate.subscribe(() => this.updateMap())
    this.two.renderer.domElement.style.background = '#fcf3d1';
  }

  updateMap(): void {
    this.RoverMap = this.roverData.getMap();
    this.render()
  }
  render() {
    //TODO: Render the map
    throw new Error('Method not implemented.');
  }

}
