import { Component, ElementRef, OnInit } from '@angular/core';
import Two from 'two.js'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  constructor(private domElement:ElementRef) { }

  private two:Two = new Two({
    type:Two.Types.canvas,
    autostart:true,
  }).appendTo(this.domElement.nativeElement);



  ngOnInit(): void {
    this.two.renderer.domElement.style.background = '#fcf3d1';
  }

}
