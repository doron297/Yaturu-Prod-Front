import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { Trip } from '../../shared/swagger/model/Trip';
import { Site } from '../../shared/swagger/model/Site';
import { TripApi } from '../../shared/swagger/api/TripApi';
import { Day } from '../../shared/swagger/model/Day';
import { Tourist } from '../../shared/swagger/model/Tourist';
import { DayApi } from '../../shared/swagger/api/DayApi';
import { Router } from '@angular/router';
import { GuideApi } from '../../shared/swagger/api/GuideApi';
import { SiteApi } from '../../shared/swagger/api/SiteApi';
import { TouristApi } from '../../shared/swagger/api/TouristApi';
import * as TripsActions from '../../store/trips/trips.ac';
import * as DaysActions from '../../store/days/days.ac';
import * as SiteActions from '../../store/sites/sites.ac';
import * as UserActions from '../../store/user/user.ac';
import * as TouristsActions from '../../store/tourists/tourists.ac';
import { SelectItem } from 'primeng/primeng';
import { DragulaDirective, DragulaService } from 'ng2-dragula/ng2-dragula';
import { LoaderComponent } from '../generalComponents/loader.component';
import { Message } from 'primeng/primeng';
interface SelectableDay {
  day: Day;
  selected: boolean;
}
@Component({
  selector: 'app200-trips-page',
  templateUrl: './tripsPage.html',
  styleUrls: ['./tripsPage.scss'],
  providers: [TripApi, DayApi, GuideApi, SiteApi, TouristApi],
  viewProviders: [DragulaService],
  directives: [DragulaDirective, LoaderComponent]
})
export class TripsPageComponent implements OnInit {
  @ViewChild('toScroll') private myScrollContainer: ElementRef;
  @select(['trips', 'filteredTrips']) trips: Array<Trip>;
  @select(['tourists', 'touristMap']) touristMap: Array<Trip>;

  selectedDays: Array<Day> = [];
  avalibleDays: Array<SelectableDay> = [];
  sitesDisplay: Array<any>;
  tripDialogVisable = false;
  editableTrip: Trip = {};
  displayDate: string = new Date(Date.now()).toLocaleDateString();
  tripsFilter = '';
  newTrip: boolean;
  titleSwitch: boolean = false;
  public groups: Array<any>;
  availableGuides: SelectItem[] = [{ label: 'Select Guide', value: null }];
  selectedTripKey: string;
  loadedDaySites: Array<Site>;
  chooseDaysVisible: boolean = false;
  displayTouristsVisible: boolean = false;
  currentTouristArr: Array<Tourist> = [];
  firstMutation: boolean = true;
  msgs: Message[] = [];
  loaderOn: Boolean = false;
  csvUrl
  constructor(private ngRedux: NgRedux<AppState>, private tripApi: TripApi,
    private dayApi: DayApi, private router: Router, private guideApi: GuideApi,
    private dragulaService: DragulaService, private siteApi: SiteApi, private touristApi: TouristApi) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }
    dragulaService.setOptions('first-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'handle fa fa-ellipsis-v';
      },
      removeOnSpill: false
    });

  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }
  showTourists(touristKey: string, tripName: string) {
    this.router.navigate(['tourists/' + touristKey + '/' + tripName]);
  }
  hideTouristDisplay() {
    this.currentTouristArr = [];
    this.displayTouristsVisible = false;
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngOnInit() {
    if (this.isAuthenticated()) {

      this.dayApi.gETDay(this.ngRedux.getState().user.token).subscribe((response: any) => {
        if (response.items) {
          this.ngRedux.dispatch(DaysActions.loadDays(response.items));
        }

        this.tripApi.gETTripTripKey(this.ngRedux.getState().user.token).subscribe((responseTrips: any) => {
          if (responseTrips.items) {
            this.ngRedux.dispatch(TripsActions.loadTrips(responseTrips.items));
            let firstTrip = this.ngRedux.getState().trips.filteredTrips[0];
            this.selectedTripKey = firstTrip.key;
            this.selectTrip(firstTrip);
            this.ngRedux.getState().trips.filteredTrips.forEach((trip) => {
              this.touristApi.gETTouristTripTripKey(trip.key,
                this.ngRedux.getState().user.token).subscribe((responseTourists: any) => {
                  this.ngRedux.dispatch(TouristsActions.loadTourists(responseTourists.items,
                    trip.key));
                });
            });

          }

          // get guides 
          this.guideApi.gETGuide(this.ngRedux.getState().user.token).subscribe((responseGuide: any) => {
            if (responseGuide.items) {
              // no need to dispatch to redux just update array
              for (let content in responseGuide.items) {
                if (responseGuide.items[content] !== null) {
                  this.availableGuides.push({
                    label: responseGuide.items[content].firstName + ' '
                      + responseGuide.items[content].lastName, value: responseGuide.items[content].key
                  });
                }
              }
            }
            this.loaderOn = false;
          }, (error) => {
            this.msgs.push({ severity: 'error', summary: 'Failed!', detail: error });
          });
        });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: error });
      });

      this.siteApi.gETSite(this.ngRedux.getState().user.token).subscribe((responseSite: any) => {
        if (responseSite.items) {
          this.ngRedux.dispatch(SiteActions.loadSites(responseSite.items));
        }
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: error });
      });

    }
  }
  showDialog() {
    this.tripDialogVisable = true;
  }
  hideDialog() {
    this.tripDialogVisable = false;
    if (this.newTrip) {
      this.newTrip = false;
    }
  }
  addTrip() {
    this.titleSwitch = true;
    this.newTrip = true;
    this.editableTrip = {
      key: Date.now().toString()
    };
    this.showDialog();
  }
  removeDay(day: Day) {
    this.selectedDays.splice(this.selectedDays.indexOf(day), 1);
    if (this.selectedDays.length === 0) {
      this.selectedDays = [];
    }
  }
  saveTrip(updateDate: boolean) {
    if (updateDate) {
      this.editableTrip.startDate = (new Date(this.displayDate)).getTime() + '';
    }
    if (this.newTrip) {
      this.tripApi.pUTTrip(this.ngRedux.getState().user.token, this.editableTrip).subscribe((response) => {
        this.editableTrip.key = response.key;
        this.ngRedux.dispatch(TripsActions.upsertTrip(this.editableTrip));
        this.msgs.push({ severity: 'info', summary: '', detail: 'Added Trip Successfully!' });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: error });
      });
    } else {
      this.tripApi.pOSTTripTripKey(this.editableTrip.key, this.ngRedux.getState().user.token, this.editableTrip).subscribe((response) => {
        this.ngRedux.dispatch(TripsActions.upsertTrip(this.editableTrip));
        this.msgs.push({ severity: 'info', summary: '', detail: 'Save Trip Successful!' });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: error });
      });

    }
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    this.hideDialog();
  }
  editTrip(trip: Trip) {
    this.titleSwitch = false;
    this.editableTrip = Object.assign({}, trip);
    this.displayDate = (new Date(parseFloat(this.editableTrip.startDate)).toLocaleDateString());
    this.showDialog();
  }
  returnGuideName(key: string) {
    for (let guide in this.availableGuides) {
      if (this.availableGuides[guide].value === key) {
        return this.availableGuides[guide].label;
      }
    }
  }
  selectTrip(trip: Trip) {
    this.loadedDaySites = [];
    this.avalibleDays = [];
    this.selectedTripKey = trip.key;
    this.selectedDays = [];
    this.ngRedux.dispatch(TripsActions.setActiveTrip(trip));
    if (trip.dayKeys && trip.dayKeys.length > 0) {
      this.ngRedux.dispatch(DaysActions.setFilterKeys(trip.dayKeys));
      this.selectedDays = this.ngRedux.getState().days.filteredDays;
      let dayArr = this.ngRedux.getState().days.days.filter((day) => {
        return !(trip.dayKeys.includes(day.key));
      });
      for (let selectableDay in dayArr) {
        if (dayArr[selectableDay]) {
          this.avalibleDays.push({ selected: false, day: dayArr[selectableDay] });
        }
      }

    } else {
      let dayArr = this.ngRedux.getState().days.days;
      for (let selectableDay in dayArr) {
        if (dayArr[selectableDay]) {
          this.avalibleDays.push({ selected: false, day: dayArr[selectableDay] });
        }
      }
    }

  }
  loadSites(key: Day): void {
    this.loadedDaySites = [];
    for (let siteKey in key.siteKeys) {
      for (let site in this.ngRedux.getState().sites.sites) {
        if (this.ngRedux.getState().sites.sites[site].key === key.siteKeys[siteKey]) {
          this.loadedDaySites.push(this.ngRedux.getState().sites.sites[site]);
        }
      }
    }
  }
  saveDays() {
    let selectedTrip = this.ngRedux.getState().trips.activeTrip;
    selectedTrip.dayKeys = [];
    this.selectedDays.forEach((day) => {
      selectedTrip.dayKeys.push(day.key);
    });
    this.newTrip = false;
    this.editableTrip = Object.assign({}, selectedTrip);
    this.saveTrip(false);
  }
  showAvailableDays() {
    this.chooseDaysVisible = true;
  }
  hideAvaiableDays() {
    this.chooseDaysVisible = false;
  }
  addThisDayToSelected(day: SelectableDay) {
    for (let selectableDay in this.avalibleDays) {
      if (this.avalibleDays[selectableDay].day.key === day.day.key) {
        this.avalibleDays[selectableDay].selected = !this.avalibleDays[selectableDay].selected;
      }
    }
  }
  cleanArray(toClean) {
    for (let i = 0; i < toClean.length; i++) {
      if (toClean[i] == null) {
        toClean.splice(i, 1);
        i--;
      }
    }
    return toClean;
  }
  viewLaodedSites(day: Day) {
    this.loadSites(day);
    return this.loadedDaySites.toString();
  }
  saveDaySelection() {
    for (let selectedDay in this.avalibleDays) {
      if (this.avalibleDays[selectedDay].selected) {
        this.selectedDays.push(this.avalibleDays[selectedDay].day);
        this.avalibleDays[selectedDay] = null;
      }
    }
    this.avalibleDays = this.cleanArray(this.avalibleDays);
    this.chooseDaysVisible = false;
  }
  removeTrip() {
    if (confirm(`Are you sure you want to remove ${this.editableTrip.name}? `)) {
      this.tripApi.dELETETripTripKey(this.editableTrip.key, this.ngRedux.getState().user.token).subscribe(() => {
        this.ngRedux.dispatch(TripsActions.removeTrip(this.editableTrip));
        this.msgs.push({ severity: 'info', summary: '', detail: 'Trip Deleted!' });
      }, (error) => {
        this.msgs.push({ severity: 'error', summary: 'Failed!', detail: error });
      });
      this.hideDialog();
    }
  }
  filterUpdate() {
    this.ngRedux.dispatch(TripsActions.searchTrips(this.tripsFilter));
  }

  getUrl(tripKey) {
    this.tripApi.getUrlDownloadTrip(tripKey, this.ngRedux.getState().user.token).subscribe(response => {
      this.csvUrl = response.url
    })
    
  }

}
