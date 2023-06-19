import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService, Settings} from '../settings.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  @ViewChild('settingsForm') settingsForm: any;

  constructor(private settingsService:SettingsService) { 
    
  }

  ngOnInit(): void {
    this.settings = this.settingsService.settings;
  }

  settings:Settings = this.settingsService.settings;

  saveSettings(){
    this.settingsService.settings = this.settings;
  }

}
