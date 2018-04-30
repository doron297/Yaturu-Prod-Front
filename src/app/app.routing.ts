import { RouterModule, Routes } from '@angular/router';

import { RegionPageComponent } from './pagesComponents/regionPage/regionPage.component';
import { ContentPageComponent } from './pagesComponents/contentPage/contentPage.component';
import { TripsPageComponent } from './pagesComponents/tripsPage/tripsPage.component';
import { SitesPageComponent } from './pagesComponents/sitesPage/sitesPage.component';
import { GuidesPageComponent } from './pagesComponents/guidesPage/guidesPage.component';
import { DaysPageComponent } from './pagesComponents/daysPage/daysPage.component';
import { LoginPageComponent } from './pagesComponents/loginPage/loginPage.component';
import { TouristsPageComponent } from './pagesComponents/touristPage/touristPage.component';
import { SpecificSiteContentComponent } from './pagesComponents/specificSiteContentPage/specificSiteContentPage.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/trips',
    pathMatch: 'full'
  },
  { path: 'regions', component: RegionPageComponent },
  { path: 'trips', component: TripsPageComponent },
  { path: 'content', component: ContentPageComponent },
  { path: 'content/:siteKey', component: SpecificSiteContentComponent },
  { path: 'sites', component: SitesPageComponent },
  { path: 'guides', component: GuidesPageComponent },
  { path: 'days', component: DaysPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'tourists/:tripKey/:tripName', component: TouristsPageComponent },
];

export const routing = RouterModule.forRoot(routes);
