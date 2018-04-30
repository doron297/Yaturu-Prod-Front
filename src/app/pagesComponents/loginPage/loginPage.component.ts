import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { Message } from 'primeng/primeng';
import * as UserActions from '../../store/user/user.ac';
import { ManagementApi } from '../../shared/swagger';

@Component({
  selector: 'app200-login-page',
  templateUrl: './loginPage.html',
  styleUrls: ['./loginPage.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ManagementApi]
})
export class LoginPageComponent implements OnInit {
  activeUserWithToken = false;
  username = 'qqqq@qqqq.qqqq';
  password = '1234';
  msgs: Message[] = [];
  constructor(private ngRedux: NgRedux<AppState>, private router: Router, private managementApi: ManagementApi) {
    this.activeUserWithToken = this.isAuthenticated();
    if (this.activeUserWithToken) {
      this.router.navigate(['/']);
    }
  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }
  ngOnInit() {
  }
  login() {
    this.managementApi.loginManager({ email: this.username, password: this.password }).subscribe((response) => {
      if (response.token) {
        let authToken = `Bearer ${response.token}`;
        this.ngRedux.dispatch(UserActions.setToken(authToken));
        this.ngRedux.dispatch(UserActions.setUser(this.username));
        this.router.navigate(['/']);
        this.msgs.push({ severity: 'info', summary: '', detail: 'login Successfull' });
      }
    }, (error) => {
      this.msgs.push({ severity: 'error', summary: 'Login Failed!', detail: error });
    });
  }
}
