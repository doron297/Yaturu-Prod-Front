import { Component } from '@angular/core';

import { ApiService } from './shared';
import { NgRedux } from 'ng2-redux';
import { AppState } from './store/appState';
import { Router } from '@angular/router';
import '../style/app.scss';

@Component({
  selector: 'app200-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private api: ApiService, private ngRedux: NgRedux<AppState>, private router: Router) {
    // Do something with api
  }
  logout() {
    this.ngRedux.getState().user.token = null;
    this.router.navigate(['login']);
  }
}
