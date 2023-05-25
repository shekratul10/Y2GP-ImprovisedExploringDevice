import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  colours = {dash:""}

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      let v = val as RouterEvent;
      switch(v.url){
        case "/dashboard":
          this.colours.dash = "primary";
          break;
      }
    });
  }

}
