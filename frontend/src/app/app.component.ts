import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSidenav, {static: false}) sidenav: MatSidenav;

  constructor() { }

  public title = 'RecruitMe (v0.3a)';
}
