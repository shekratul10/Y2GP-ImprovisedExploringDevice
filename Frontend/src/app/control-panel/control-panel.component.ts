import { Component, OnInit } from '@angular/core';
import { RoverDataService } from '../rover-data.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  constructor(private roverData:RoverDataService) { }
   
  ngOnInit(): void {
  }

}
