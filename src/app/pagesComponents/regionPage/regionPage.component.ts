import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { RegionApi } from '../../shared/swagger';
import * as RegionActions from '../../store/region/region.ac';
import { Region } from '../../shared/swagger/model/Region';
import * as UserActions from '../../store/user/user.ac';
import { Message } from 'primeng/primeng';
import { LoaderComponent } from '../generalComponents/loader.component';
let $ = window['$'];

@Component({
  selector: 'app200-regions-page',
  templateUrl: './regionPage.html',
  styleUrls: ['./regionPage.scss'],
  providers: [RegionApi],
  directives: [LoaderComponent]
})
export class RegionPageComponent implements OnInit {
  @select(['regions', 'filteredRegions']) regions: Array<Region>;
  dialogVisable = false;
  newRegion: boolean = false;
  editableRegion: Region = {};
  regionFilter = '';
  imagePreviewVisible = false;
  showUpload: boolean = true;
  cancelUpload: boolean = false;
  uploadDone: boolean = false;
  titleSwitch: boolean = false;
  loaderOn = true;
  msgs: Message[] = [];
  constructor(private ngRedux: NgRedux<AppState>, private router: Router,
    private regionApi: RegionApi) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }

  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }

  showImagePreview(content: Region) {
    this.editableRegion = Object.assign({}, content);
    this.imagePreviewVisible = true;
  }
  ngOnInit() {
    if (this.isAuthenticated()) {
      this.regionApi.gETRegion(this.ngRedux.getState().user.token).subscribe((response: any) => {
        if (response.items) {
          this.ngRedux.dispatch(RegionActions.loadRegions(response.items));
        }
        this.loaderOn = false;
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: 'Could not load Page!' });
      });
      $('.upload_form').append($.cloudinary.unsigned_upload_tag('cet7owh3',
        { cloud_name: 'maatayem' }));
      $('.cloudinary_fileupload').unsigned_cloudinary_upload('cet7owh3',
        { cloud_name: 'maatayem' },
        { multiple: false }
      ).bind('cloudinarydone', (e, data) => {
        if (data.textStatus === 'success') {
          this.editableRegion.imageUrl = data.result.secure_url;
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
    delete this.editableRegion.imageUrl;
  }
  showDialog() {
    this.dialogVisable = true;
    this.cancelUpload = false;
  }
  hideDialog() {
    this.dialogVisable = false;
    this.showUpload = true;
    this.cancelUpload = true;
    if (this.newRegion) {
      this.newRegion = false;
    }
  }
  addRegion() {
    this.titleSwitch = true;
    this.newRegion = true;
    this.editableRegion = {};
    this.showDialog();
  }
  saveRegion() {
    if (this.newRegion) {
      this.regionApi.pUTRegion(this.ngRedux.getState().user.token, this.editableRegion).subscribe((response) => {
        this.editableRegion.key = response.key;
        this.ngRedux.dispatch(RegionActions.upsertRegion(this.editableRegion));
        this.msgs.push({ severity: 'info', summary: '', detail: 'Creating Region Successfull' });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Creating Region Failed!', detail: error });
      });
    } else {
      this.regionApi.pOSTRegionRegionKey(this.editableRegion.key,
        this.ngRedux.getState().user.token, this.editableRegion).subscribe((value) => {
          this.ngRedux.dispatch(RegionActions.upsertRegion(this.editableRegion));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Saving Region Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Saving Region Failed!', detail: error });
        });
    }
    this.hideDialog();
  }
  editregion(region: Region) {
    this.titleSwitch = false;
    this.editableRegion = Object.assign({}, region);
    this.showDialog();
  }
  removeRegion() {
    if (confirm(`Are you sure you want to remove ${this.editableRegion.name}? `)) {
      this.regionApi.dELETERegionRegionKey(this.editableRegion.key,
        this.ngRedux.getState().user.token).subscribe(() => {
          this.ngRedux.dispatch(RegionActions.removeRegion(this.editableRegion));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Deleting Region Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Deleting Region Failed!', detail: error });
        });
      this.hideDialog();
    }
  }
  filterUpdate() {
    this.ngRedux.dispatch(RegionActions.searchRegion(this.regionFilter));
  }
}
