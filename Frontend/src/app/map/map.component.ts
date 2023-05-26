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

  RoverMap:RoverMap = this.roverData.getMap();
  displaySize = {x:400,y:400}; // Size of the map in pixels

  //Use two.js to render the map
  private two:Two = new Two({
    type:Two.Types.canvas,
    autostart:true,
  })



  ngOnInit(): void {
    this.two.appendTo(this.domElement.nativeElement.querySelector('div.map'));
    this.roverData.roverMapUpdate.subscribe(() => this.updateMap())
    this.two.renderer.setSize(this.displaySize.x,this.displaySize.y);
    this.render();
  }

  updateMap(): void {
    this.RoverMap = this.roverData.getMap();
    this.render()
  }
  render() {
    this.drawGrid();
    //TODO: Render the map
    //throw new Error('Method not implemented.');
    this.two.update();
  }

  drawGrid(){
    // Draw a grid of squares to represent the map
    let nHorizontal = this.displaySize.x / this.RoverMap.map[0].length;
    let nVertical = this.displaySize.y / this.RoverMap.map.length;
    for(let i = 0; i < this.RoverMap.map[0].length; i++){
      for(let j = 0; j < this.RoverMap.map.length; j++){
        let s = this.two.makeRectangle(
          (i+0.5)*(this.displaySize.x/this.RoverMap.map[0].length),
          (j+0.5)*(this.displaySize.y/this.RoverMap.map.length),
          this.displaySize.x / this.RoverMap.map[0].length,
          this.displaySize.y / this.RoverMap.map.length
        );
        s.linewidth = 0.5;
        if(this.RoverMap.map[j][i] == 0) s.fill = "grey";
        if(this.RoverMap.map[j][i] == 1) s.fill = "white";
        if(this.RoverMap.map[j][i] == -1) s.fill = "#333333";
      }
    }
  }

}
