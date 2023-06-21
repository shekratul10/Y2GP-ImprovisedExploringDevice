import { Component, ElementRef, OnInit } from '@angular/core';
import Two from 'two.js'
import { RoverDataService, RoverMap } from '../rover-data.service';
import { Rectangle } from 'two.js/src/shapes/rectangle';
import { Vector } from 'two.js/src/vector';


const edgeOffset = 10;
const unitSize = 3;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private domElement:ElementRef, private roverData:RoverDataService) { }

  RoverMap:RoverMap = this.roverData.getMap();
  displaySize = {x:700,y:700}; // Size of the map in pixels
  //Use two.js to render the map
  private two:Two = new Two({
    type:Two.Types.canvas,
    autostart:true,
  })
  
  roverBox:Rectangle = this.two.makeRectangle(0,0,5,10);


  ngOnInit(): void {
    this.two.appendTo(this.domElement.nativeElement.querySelector('div.map'));
    this.two.renderer.domElement.style.background = 'black';
    this.roverData.roverMapUpdate.subscribe(() => this.updateMap());
    this.two.renderer.setSize(this.displaySize.x,this.displaySize.y);
    this.roverData.telemetryUpdate.subscribe(() => this.drawRover());
    this.roverBox.fill = 'blue';
    this.render();
  }

  updateMap(): void {
    this.RoverMap = this.roverData.getMap();
    this.render();
  }
  render() {
    this.drawMap();
    this.drawRover();
    //throw new Error('Method not implemented.');
    this.two.update();
  }

  drawMap(){
    this.two.clear(); //Clear the display
    // Draw a circle for each node, and a line for each edge.
    for(let node of this.RoverMap.nodes){
      this.two.makeCircle((node.position.x*unitSize)+edgeOffset,(node.position.y*unitSize)+edgeOffset,10).fill = 'yellow';
    }
    for(let edge of this.RoverMap.edges){
      let source = this.RoverMap.nodes.find((node) => node.id === edge.source)?.position;
      let target = this.RoverMap.nodes.find((node) => node.id === edge.target)?.position;
      if(source && target){
        let l = this.two.makeLine((source.x*unitSize)+edgeOffset,(source.y*unitSize)+edgeOffset,(target.x*unitSize)+edgeOffset,(target.y*unitSize)+edgeOffset);
        l.linewidth = edge.weight
        l.stroke = 'red';
      }
    }
    this.two.add(this.roverBox); //Add back the rover
    this.drawRover();
  }

  drawRover(){
    let rover = this.roverData.getTelemetry();
    if(rover){
      if(rover.position.x*unitSize +edgeOffset != this.roverBox.position.x || rover.position.y*unitSize + edgeOffset != this.roverBox.position.y){
        this.two.makeLine(this.roverBox.position.x,this.roverBox.position.y,rover.position.x*unitSize+edgeOffset,rover.position.y*unitSize+edgeOffset).stroke = 'yellow';
      }
      this.roverBox.position = new Vector(rover.position.x*unitSize+edgeOffset,rover.position.y*unitSize+edgeOffset);
      this.roverBox.rotation = -rover.angle;
    }
  }



}
