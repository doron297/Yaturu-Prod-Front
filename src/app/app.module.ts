import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DevToolsExtension, NgRedux } from 'ng2-redux';
import {
  DialogModule, CalendarModule, MultiSelectModule, PickListModule, TooltipModule,
  DropdownModule, GrowlModule
} from 'primeng/primeng';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { AppComponent } from './app.component';

import { RegionPageComponent } from './pagesComponents/regionPage/regionPage.component';

import { ApiService } from './shared';
import { routing } from './app.routing';

import { rootReducer } from './store/root.reducer';
import * as IAppState from './store/appState';


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    DialogModule, CalendarModule, MultiSelectModule, PickListModule, TooltipModule, DropdownModule, GrowlModule,
    DragulaModule,
  ],
  declarations: [
    AppComponent,
    RegionPageComponent,
  ],
  providers: [
    ApiService,
    NgRedux,
    DevToolsExtension
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, private ngRedux: NgRedux<IAppState.AppState>,
    private devTools: DevToolsExtension) {

    let enhancers = [];
    if (devTools.isEnabled()) {
      enhancers = [...enhancers, devTools.enhancer()];
    }

    this.ngRedux.configureStore(
      rootReducer,
      IAppState.initialState,
      [],
      enhancers);

  }
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
