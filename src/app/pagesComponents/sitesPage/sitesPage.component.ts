import { Component, OnInit } from '@angular/core';
import { Header } from 'primeng/primeng';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { SiteApi } from '../../shared/swagger/api/SiteApi';
import { Site } from '../../shared/swagger/model/Site';
import { ContentApi } from '../../shared/swagger/api/ContentApi';
import { RegionApi } from '../../shared/swagger/api/RegionApi';
import * as SitesActions from '../../store/sites/sites.ac';
import * as RegionActions from '../../store/region/region.ac';
import * as UserActions from '../../store/user/user.ac';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { LoaderComponent } from '../generalComponents/loader.component';
let $ = window['$'];

@Component({
  selector: 'app200-sites-page',
  templateUrl: './sitesPage.html',
  styleUrls: ['./sitesPage.scss'],
  directives: [Header, LoaderComponent],
  providers: [SiteApi, ContentApi, RegionApi]
})
export class SitesPageComponent implements OnInit {
  @select(['sites', 'filteredSites']) sites: Array<Site>;
  dialogVisable = false;
  displayContent: SelectItem[] = [];
  editableSite: Site = {};
  siteFilter = '';
  newSite: boolean;
  imagePreviewVisible: boolean = false;
  availableRegions: SelectItem[] = [{ label: 'Select Region', value: null }];
  showUpload: boolean = true;
  cancelUpload: boolean = false;
  uploadDone: boolean = false;
  titleSwitch: boolean = false;
  loaderOn: Boolean = true;
  msgs: Message[] = [];
  constructor(private ngRedux: NgRedux<AppState>, private siteApi: SiteApi,
    private router: Router, private contentApi: ContentApi, private regionApi: RegionApi) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }
  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }
  previewImage(site: Site) {
    this.editableSite = Object.assign({}, site);
    this.imagePreviewVisible = true;
  }
  ngOnInit() {
    if (this.isAuthenticated()) {
      // get regions
      this.regionApi.gETRegion(this.ngRedux.getState().user.token).subscribe((response: any) => {
        if (response.items) {
          this.ngRedux.dispatch(RegionActions.loadRegions(response.items));

          // no need to dispatch to redux just update array
          for (let region in response.items) {
            if (response.items[region] !== null) {
              this.availableRegions.push({ label: response.items[region].name, value: response.items[region].key });
            }
          }
        }
        // get sites
        this.siteApi.gETSite(this.ngRedux.getState().user.token).subscribe((responseSite: any) => {
          if (responseSite.items) {
            this.ngRedux.dispatch(SitesActions.loadSites(responseSite.items));
          }
          // get content
          this.contentApi.gETContent(this.ngRedux.getState().user.token).subscribe((responseContent: any) => {
            if (responseContent.items) {
              // no need to dispatch to redux just update array
              for (let content in responseContent.items) {
                if (responseContent.items[content] !== null) {
                  this.displayContent.push({ label: responseContent.items[content].name, value: responseContent.items[content].key });
                }
              }
            }
            this.loaderOn = false;
          }, (error) => {
            this.msgs.push({ severity: 'error', summary: 'Failed!', detail: 'Could not load Page!' });
          });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Failed!', detail: 'Could not load Page!' });
        });
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
          this.editableSite.imageUrl = data.result.secure_url;
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

  getRegionName(key: string) {
    let regionArray = this.ngRedux.getState().regions.regions;
    for (let region in regionArray) {
      if (regionArray[region]) {
        if (regionArray[region].key === key) {
          return regionArray[region].name;
        }
      }
    }
    return 'Not Found';
  }
  cancelUploadfunction() {
    this.cancelUpload = true;
    this.showUpload = true;
    this.uploadDone = false;
  }
  removeUploadfunction() {
    this.uploadDone = false;
    this.showUpload = true;
    delete this.editableSite.imageUrl;
  }
  showDialog() {
    this.dialogVisable = true;
    this.cancelUpload = false;
  }
  hideDialog() {
    this.dialogVisable = false;
    this.showUpload = true;
    this.cancelUpload = true;
    if (this.newSite) {
      this.newSite = false;
    }
  }
  addSite() {
    this.titleSwitch = true;
    this.newSite = true;
    this.editableSite = {
      key: Date.now().toString()
    };
    this.showDialog();
  }
  saveSite() {
    if (this.newSite) {
      this.siteApi.pUTSite(this.ngRedux.getState().user.token, this.editableSite).subscribe((response) => {
        this.editableSite.key = response.key;
        this.ngRedux.dispatch(SitesActions.upsertSite(this.editableSite));
      });
    } else {
      this.siteApi.pOSTSiteSiteKey(this.editableSite.key, this.ngRedux.getState().user.token, this.editableSite).subscribe((vaule) => {
        this.ngRedux.dispatch(SitesActions.upsertSite(this.editableSite));
      });
    }
    this.hideDialog();
  }
  editSite(site: Site) {
    this.titleSwitch = false;
    this.editableSite = Object.assign({}, site);
    this.showDialog();
  }
  removeSite() {
    if (confirm(`Are you sure you want to remove ${this.editableSite.name}? `)) {
      this.siteApi.dELETESiteSiteKey(this.editableSite.key,
        this.ngRedux.getState().user.token).subscribe(() => {
          this.ngRedux.dispatch(SitesActions.removeSite(this.editableSite));
        });
      this.hideDialog();
    }
  }
  filterUpdate() {
    this.ngRedux.dispatch(SitesActions.searchSite(this.siteFilter));
  }
}
