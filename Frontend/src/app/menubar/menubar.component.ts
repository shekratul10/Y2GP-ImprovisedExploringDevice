import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss']
})
export class MenubarComponent implements OnInit {

  colours = {dash:"", cons:""};
  title = "Improvised Exploring Device";

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      //get current router route
      let v = this.router.url
      switch(v){
        case "/dashboard":
          this.colours.dash = "primary";
          this.colours.cons = "";
          break;
        case "/console":
          this.colours.dash = "";
          this.colours.cons = "primary";
          break;
        default:
          this.colours.dash = "";
          this.colours.cons = "";
          break;
      }
    });
  }

}
