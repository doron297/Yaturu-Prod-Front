import { Component, OnInit } from '@angular/core';
import { Header } from 'primeng/primeng';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { Router } from '@angular/router';
import { Day } from '../../shared/swagger';
import { Site } from '../../shared/swagger';
import { DayApi } from '../../shared/swagger/api/DayApi';
import { SiteApi } from '../../shared/swagger/api/SiteApi';
import * as DaysActions from '../../store/days/days.ac';
import * as SitesActions from '../../store/sites/sites.ac';
import * as UserActions from '../../store/user/user.ac';
import { Message } from 'primeng/primeng';
import { LoaderComponent } from '../generalComponents/loader.component';
interface SelectableSite {
  site: Site;
  selected: boolean;
}
@Component({
  selector: 'app200-days-page',
  templateUrl: './daysPage.html',
  styleUrls: ['./daysPage.scss'],
  directives: [Header, LoaderComponent],
  providers: [DayApi, SiteApi],
})

export class DaysPageComponent implements OnInit {
  @select(['days', 'days']) days: Array<Day>;
  dialogVisable = false;
  displaySites: Array<any>;
  selectedSites: Array<string> = [];
  selectedSiteKeys: Array<string>;
  editableDay: Day = {};
  daysFilter = '';
  newDay: boolean;
  selectedDayKey: string;
  loadedDaySites: Array<Site>;
  titleSwitch: boolean = false;
  loaderOn: Boolean = true;
  chooseSitesVisible: boolean = false;
  availableSites: Array<SelectableSite> = [];
  msgs: Message[] = [];
  constructor(private ngRedux: NgRedux<AppState>, private siteApi: SiteApi, private dayApi: DayApi, private router: Router) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }
  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }
  ngOnInit() {
    if (this.isAuthenticated()) {
      this.siteApi.gETSite(this.ngRedux.getState().user.token).subscribe((response: any) => {
        if (response.items) {
          this.ngRedux.dispatch(SitesActions.loadSites(response.items));
        }
        this.dayApi.gETDay(this.ngRedux.getState().user.token).subscribe((responseDay: any) => {
          if (responseDay.items) {
            this.ngRedux.dispatch(DaysActions.loadDays(responseDay.items));
            if (responseDay.items.length !== 0) {
              this.selectedDayKey = responseDay.items[0].key;
              this.selectDay(responseDay.items[0]);
            }
          }
          this.loaderOn = false;
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Failed!', detail: 'Could not load Page!' });
        });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: 'Could not load Page!' });
      });
    }
  }
  addSite() {
    if (this.availableSites) {
      let siteArr = this.ngRedux.getState().sites.sites;
      for (let site in siteArr) {
        if (siteArr[site]) {
          let toAdd = { selected: false, site: siteArr[site] };
          for (let editableSite in this.editableDay.siteKeys) {
            if (siteArr[site].key === this.editableDay.siteKeys[editableSite]) {
              toAdd.selected = true;
            }
          }
          this.availableSites.push(toAdd);
        }
      }
    } else {
      for (let site in this.availableSites) {
        if (this.availableSites[site]) {
          this.availableSites[site].selected = false;
        }
      }
    }
    this.chooseSitesVisible = true;
  }
  hideAvaiableSites() {
    this.chooseSitesVisible = false;
  }
  removeSite(site: Site) {
    if (confirm(`Are you sure you want to remove ${site.name}? `)) {
      for (let toDelete in this.editableDay.siteKeys) {
        if (this.editableDay.siteKeys[toDelete]) {
          if (this.editableDay.siteKeys[toDelete] === site.key) {
            this.editableDay.siteKeys.splice(<any>toDelete, 1);
          }
        }
      }
      if (this.loadedDaySites !== undefined) {
        this.loadedDaySites = this.loadedDaySites.filter((loadedDaySite: Site) => {
          return (loadedDaySite.key !== site.key);
        });
      }
      this.dayApi.pOSTDayDayKey(this.editableDay.key,
        this.ngRedux.getState().user.token, this.editableDay).subscribe(() => {
          this.ngRedux.dispatch(DaysActions.upsertDay(this.editableDay));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Remove Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Save Failed!', detail: error });
        });
    }
  }
  saveSiteSelection() {
    this.loadedDaySites = [];
    this.editableDay.siteKeys = [];
    for (let selectableSite in this.availableSites) {
      if (this.availableSites[selectableSite]) {
        if (this.availableSites[selectableSite].selected) {
          this.editableDay.siteKeys.push(this.availableSites[selectableSite].site.key);
          this.loadedDaySites.push(this.availableSites[selectableSite].site);
        }
      }
    }
    this.dayApi.pOSTDayDayKey(this.editableDay.key, this.ngRedux.getState().user.token, this.editableDay).subscribe((value) => {
      this.ngRedux.dispatch(DaysActions.upsertDay(this.editableDay));
      this.msgs.push({ severity: 'info', summary: '', detail: 'Site Selection Saved!' });
    }, (error) => {
      this.msgs.push({ severity: 'error', summary: 'Could Not Save Your Selection!', detail: error });
    });
    this.availableSites = [];
    this.chooseSitesVisible = false;
  }
  addThisSiteToSelected(site: SelectableSite) {
    for (let selectableSite in this.availableSites) {
      if (this.availableSites[selectableSite]) {
        if (this.availableSites[selectableSite].site.key === site.site.key) {
          this.availableSites[selectableSite].selected = !this.availableSites[selectableSite].selected;
        }
      }
    }
  }
  selectDay(day: Day) {
    this.editableDay = Object.assign({}, day);
    this.selectedDayKey = day.key;
    this.loadSites(day);
  }
  loadSites(day: Day): void {
    this.loadedDaySites = [];
    for (let siteKey in day.siteKeys) {
      if (day.siteKeys[siteKey]) {
        for (let site in this.ngRedux.getState().sites.sites) {
          if (this.ngRedux.getState().sites.sites !== undefined) {
            if (this.ngRedux.getState().sites.sites[site].key === day.siteKeys[siteKey]) {
              this.loadedDaySites.push(this.ngRedux.getState().sites.sites[site]);
            }
          }
        }
      }
    }
  }
  showDialog() {
    this.dialogVisable = true;
  }
  hideDialog() {
    this.selectedSiteKeys = [];
    this.dialogVisable = false;
    if (this.newDay) {
      this.newDay = false;
    }
  }
  addDay() {
    this.titleSwitch = true;
    this.newDay = true;
    this.editableDay = {
      key: Date.now().toString()
    };
    this.displaySites = [];
    this.selectedSiteKeys = [];
    this.ngRedux.getState().sites.sites.forEach((site) => {
      this.displaySites.push({ label: site.name, value: site.key });
    });
    this.showDialog();
  }
  saveDay() {
    this.editableDay.siteKeys = this.selectedSiteKeys;
    if (this.newDay) {
      this.dayApi.pUTDay(this.ngRedux.getState().user.token, this.editableDay).subscribe((response) => {
        this.editableDay.key = response.key;
        this.ngRedux.dispatch(DaysActions.upsertDay(this.editableDay));
        this.msgs.push({ severity: 'info', summary: '', detail: 'Creating Day Successfull' });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Creating Day Failed!', detail: error });
      });
      this.ngRedux.dispatch(DaysActions.upsertDay(this.editableDay));
    } else {
      this.dayApi.pOSTDayDayKey(this.editableDay.key, this.ngRedux.getState().user.token, this.editableDay).subscribe((value) => {
        this.ngRedux.dispatch(DaysActions.upsertDay(this.editableDay));
        this.msgs.push({ severity: 'info', summary: '', detail: 'Saving Day Successfull' });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Saving Day Failed!', detail: error });
      });
    }
    this.hideDialog();
  }
  editDay(day: Day) {
    this.titleSwitch = false;
    this.editableDay = Object.assign({}, day);
    if (day.siteKeys !== undefined) {
      this.selectedSiteKeys = day.siteKeys.concat([]);
    } else {
      this.selectedSiteKeys = [];
    }
    this.displaySites = [];
    this.ngRedux.getState().sites.sites.forEach((site) => {
      this.displaySites.push({ label: site.name, value: site.key });
    });
    this.showDialog();
  }
  removeDay() {
    if (confirm(`Are you sure you want to remove ${this.editableDay.description}? `)) {
      this.dayApi.dELETEDayDayKey(this.editableDay.key,
        this.ngRedux.getState().user.token).subscribe(() => {
          this.ngRedux.dispatch(DaysActions.removeDay(this.editableDay));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Removing Day Successfull' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Could Not Remove Day!', detail: error });
        });
      this.hideDialog();
    }
  }
}
