import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'
import { AppComponent } from './app.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'
import { FrontpageComponent } from './frontpage/frontpage.component';
import { MenubarComponent } from './menubar/menubar.component';
import { ConsoleComponent } from './console/console.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field'
import { MatInputModule} from '@angular/material/input'


const routes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'console', component: ConsoleComponent },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'settings', component: SettingsPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    FrontpageComponent,
    MenubarComponent,
    ConsoleComponent,
    SettingsPageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatCardModule,
    HttpClientJsonpModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
    
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
