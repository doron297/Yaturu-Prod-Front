import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { TouristApi } from '../../shared/swagger';
import { TripApi } from '../../shared/swagger';
import * as TouristActions from '../../store/tourists/tourists.ac';
import { Tourist } from '../../shared/swagger/model/Tourist';
import { Trip } from '../../shared/swagger/model/Trip';
import * as UserActions from '../../store/user/user.ac';
import { Message } from 'primeng/primeng';
@Component({
  selector: 'app200-tourists-page',
  templateUrl: './touristPage.component.html',
  styleUrls: ['./touristPage.component.scss'],
  providers: [TouristApi, TripApi]
})
export class TouristsPageComponent implements OnInit {
  @select(['tourists', 'touristMap']) tourists: Array<Tourist>;
  dialogVisable = false;
  newTourist = false;
  editableTourist: Tourist = {};
  touristFilter = '';
  imagePreviewVisible = false;
  showUpload: boolean = true;
  cancelUpload: boolean = false;
  uploadDone: boolean = false;
  titleSwitch: boolean = false;
  currentTrip: Trip = {};
  session = undefined;
  tripKey = undefined;
  tripName = undefined;
  msgs: Message[] = [];
  constructor(private ngRedux: NgRedux<AppState>, private router: Router,
    private touristApi: TouristApi, private activatedRoute: ActivatedRoute) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }

  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }
  showImagePreview(Tourist: Tourist) {
    this.editableTourist = Object.assign({}, Tourist);
    this.imagePreviewVisible = true;
  }
  ngOnInit() {
    if (this.isAuthenticated()) {

      this.tripKey = decodeURI(this.router.url).split('/')[2];

      this.activatedRoute.params.subscribe((params) => {
        this.tripKey = params['tripKey'];
        this.tripName = params['tripName'];
      });
      if (!this.tripKey) {
        this.router.navigate(['trips']);
      }
    }
  }
  showDialog() {
    this.dialogVisable = true;
    this.cancelUpload = false;
  }
  hideDialog() {
    this.dialogVisable = false;
    this.showUpload = true;
    this.cancelUpload = true;
    if (this.newTourist) {
      this.newTourist = false;
    }
  }
  addTourist() {
    this.titleSwitch = true;
    this.newTourist = true;
    this.editableTourist = {};
    this.showDialog();
  }
  saveTourist() {
    this.editableTourist.tripKey = this.tripKey;
    if (this.newTourist) {
      this.touristApi.pUTTourist(this.ngRedux.getState().user.token, this.editableTourist).subscribe((response) => {
        this.editableTourist.key = response.key;
        this.ngRedux.dispatch(TouristActions.upsertTourist(this.editableTourist, this.tripKey));
        this.msgs.push({ severity: 'info', summary: '', detail: 'Create Successfull' });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Create Failed!', detail: error });
      });
    } else {
      this.touristApi.pOSTTouristTouristKey(this.editableTourist.key,
        this.ngRedux.getState().user.token, this.editableTourist).subscribe((value) => {
          this.ngRedux.dispatch(TouristActions.upsertTourist(this.editableTourist, this.tripKey));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Save Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Save Failed!', detail: error });
        });
    }
    this.hideDialog();
  }
  editTourist(Tourist: Tourist) {
    this.titleSwitch = false;
    this.editableTourist = Object.assign({}, Tourist);
    this.showDialog();
  }
  removeTourist() {
    if (confirm(`Are you sure you want to remove ${this.editableTourist.firstName}? `)) {
      this.touristApi.dELETETouristTouristKey(this.editableTourist.key,
        this.ngRedux.getState().user.token).subscribe(() => {
          this.ngRedux.dispatch(TouristActions.removeTourist(this.editableTourist, this.tripKey));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Remove Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Remove Failed!', detail: error });
        });
      this.hideDialog();
    }
  }
}
