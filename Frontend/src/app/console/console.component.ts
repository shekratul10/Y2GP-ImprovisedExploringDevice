import { Component, OnInit } from '@angular/core';
import { ConsoleEntry, ConsoleService } from '../console.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  constructor(public log:ConsoleService) { }

  ngOnInit(): void {
  }

  

}
