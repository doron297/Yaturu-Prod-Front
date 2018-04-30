import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { GuideApi } from '../../shared/swagger';
import * as GuideActions from '../../store/guides/guides.ac';
import * as UserActions from '../../store/user/user.ac';
import { Guide } from '../../shared/swagger/model/Guide';
import { Message } from 'primeng/primeng';
import { LoaderComponent } from '../generalComponents/loader.component';
let $ = window['$'];

@Component({
  selector: 'app200-guides-page',
  templateUrl: './guidesPage.component.html',
  styleUrls: ['./guidesPage.component.scss'],
  providers: [GuideApi],
  directives: [LoaderComponent]
})
export class GuidesPageComponent implements OnInit {
  @select(['guides', 'filteredGuides']) guides: Array<Guide>;
  dialogVisable = false;
  newGuide = false;
  newGuidePassword: string;
  newPassword: string;
  editableGuide: Guide = {};
  guideFilter = '';
  imagePreviewVisible = false;
  showUpload: boolean = true;
  cancelUpload: boolean = false;
  uploadDone: boolean = false;
  titleSwitch: boolean = false;
  msgs: Message[] = [];
  loaderOn: Boolean = true;
  constructor(private ngRedux: NgRedux<AppState>, private router: Router,
    private guideApi: GuideApi) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }

  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }

  showImagePreview(guide: Guide) {
    this.editableGuide = Object.assign({}, guide);
    this.imagePreviewVisible = true;
  }
  ngOnInit() {
    if (this.isAuthenticated()) {
      let errored: Boolean = false;
      this.guideApi.gETGuide(this.ngRedux.getState().user.token).subscribe((response: any) => {
        if (response.items) {
          this.ngRedux.dispatch(GuideActions.loadGuides(response.items));
        }
        this.loaderOn = false;
      }, (error) => {
        errored = true;
      });
      $('.upload_form').append($.cloudinary.unsigned_upload_tag('cet7owh3',
        { cloud_name: 'maatayem' }));
      $('.cloudinary_fileupload').unsigned_cloudinary_upload('cet7owh3',
        { cloud_name: 'maatayem' },
        { multiple: false }
      ).bind('cloudinarydone', (e, data) => {
        if (data.textStatus === 'success') {
          this.editableGuide.imageUrl = data.result.secure_url;
          $('.bar').css('width', '100%');
          this.uploadDone = true;
        }
      }).bind('cloudinaryprogress', (e, data) => {
        if (this.showUpload) {
          this.showUpload = false;
        }
        if (this.cancelUpload) {
          this.uploadDone = false;
          data.xhr().abort();
          this.showUpload = true;
          this.cancelUpload = false;
        }
        $('.bar').css('width',
          Math.round((data.loaded * 100.0) / data.total) + '%');
      });
      if (errored) {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: 'Could not load Page!' });
      }
    }
  }
  cancelUploadfunction() {
    this.cancelUpload = true;
    this.showUpload = true;
    this.uploadDone = false;
  }
  removeUploadfunction() {
    this.uploadDone = false;
    this.showUpload = true;
    delete this.editableGuide.imageUrl;
  }
  showDialog() {
    this.dialogVisable = true;
    this.cancelUpload = false;
  }
  hideDialog() {
    this.dialogVisable = false;
    this.showUpload = true;
    this.cancelUpload = true;
    if (this.newGuide) {
      this.newGuide = false;
    }
  }
  addGuide() {
    this.titleSwitch = true;
    this.newGuide = true;
    this.editableGuide = {};
    this.showDialog();
  }
  saveGuide() {
    if (this.newGuide) {
      this.guideApi.pUTGuide(this.ngRedux.getState().user.token,
        { guide: this.editableGuide, password: this.newGuidePassword }).subscribe((response) => {
          this.editableGuide.key = response.key;
          this.ngRedux.dispatch(GuideActions.upsertGuide(this.editableGuide));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Creating Guide Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Create Failed!', detail: error });
        });
    } else {
      this.guideApi.pOSTGuideGuideKey(this.editableGuide.key,
        this.ngRedux.getState().user.token, this.editableGuide).subscribe((value) => {
          this.ngRedux.dispatch(GuideActions.upsertGuide(this.editableGuide));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Saving Guide Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Save Failed!', detail: error });
        });
    }
    this.hideDialog();
  }
  editGuide(guide: Guide) {
    this.titleSwitch = false;
    this.editableGuide = Object.assign({}, guide);
    this.showDialog();
  }
  removeGuide() {
    if (confirm(`Are you sure you want to remove ${this.editableGuide.displayName}? `)) {
      this.guideApi.dELETEGuideGuideKey(this.editableGuide.key,
        this.ngRedux.getState().user.token).subscribe(() => {
          this.ngRedux.dispatch(GuideActions.removeGuide(this.editableGuide));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Remove Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Save Failed!', detail: error });
        });
      this.hideDialog();
    }
  }
  filterUpdate() {
    this.ngRedux.dispatch(GuideActions.searchGuide(this.guideFilter));
  }
  resetPassword() {
    let body = {
      email: this.editableGuide.email,
      password: this.newPassword
    }
    this.guideApi.postResetPassword(this.ngRedux.getState().user.token, body).subscribe(_ => { 
      this.newPassword = null
      this.msgs.push({ severity: 'info', summary: '', detail: 'Updated Successfull' });
    }, (error) => {
      this.msgs.push({ severity: 'error', summary: 'Update Failed!', detail: error });
    })
  }
}
