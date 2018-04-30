import { Component, OnInit, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { Content } from '../../shared/swagger/model/Content';
import { ContentApi } from '../../shared/swagger/api/ContentApi';
import { SiteContent } from '../../shared/swagger/model/SiteContent';
import { SiteApi } from '../../shared/swagger/api/SiteApi';
import * as ContentActions from '../../store/content/content.ac';
import * as UserActions from '../../store/user/user.ac';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  transform(input) {
    if (typeof input === 'number') {
      let min = Math.floor(input / 60);
      let seconds = Math.floor(input % 60);
      let minPrefix = min < 10 ? '0' : '';
      let secPrefix = seconds < 10 ? '0' : '';

      return `${minPrefix}${Math.floor(input / 60)}:${secPrefix}${Math.floor(input % 60)} sec`;
    }
    return `--`;
  }
}

@Pipe({ name: 'excludeContent' })
export class ExclusionPipe implements PipeTransform {
  transform(input: Array<Content>, toExclude: Array<string>) {
    if (toExclude) {
      return input.filter((content) => {
        return !toExclude.includes(content.key);
      });
    }
    return input;
  }
}

@Component({
  selector: 'app200-sites-page',
  templateUrl: './specificSiteContentPage.component.html',
  styleUrls: ['./specificSiteContentPage.component.scss'],
  providers: [ContentApi, SiteApi],
  pipes: [DurationPipe, ExclusionPipe]
})
export class SpecificSiteContentComponent implements OnInit {
  @select(['content', 'filteredContent']) content: Array<Content>;
  dialogVisable = false;
  lightboxVisible = false;
  questionBoxVisible = false;
  editableContent: Content = {};
  editableSiteContent: SiteContent = {};
  newContent: boolean = false;
  contentFilter = '';
  cloudinaryImage: any;
  showUpload: boolean = true;
  cancelUpload: boolean = false;
  uploadDone: boolean = false;
  titleSwitchQuestion: boolean = false;
  titleSwitchContent: boolean = false;
  siteKey: string = undefined;
  selectedContent: string;
  msgs: Message[] = [];
  constructor(private ngRedux: NgRedux<AppState>, private contentApi: ContentApi,
    private router: Router, private applicationRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute, private siteApi: SiteApi) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }
  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }
  ngOnInit() {
    if (this.isAuthenticated()) {
      this.activatedRoute.params.subscribe((params) => {
        this.siteKey = params['siteKey'];
        this.siteApi.gETSiteByKey(this.siteKey, this.ngRedux.getState().user.token).subscribe((response: any) => {
          this.editableSiteContent = response;
          this.editableSiteContent.contentKeys = [];
          for (let index in this.editableSiteContent.contents) {
            if (this.editableSiteContent.contents[index]) {
              this.editableSiteContent.contentKeys.push(this.editableSiteContent.contents[index].key);
            }
          }
          this.contentApi.gETContent(this.ngRedux.getState().user.token).subscribe((responseContent: any) => {
            this.ngRedux.dispatch(ContentActions.loadContent(responseContent.items));
          });
        });
      });
    }
  }
  addToSite(content: Content) {
    if (!this.editableSiteContent.contents) {
      this.editableSiteContent.contents = [];
    }
    this.editableSiteContent.contents.push(content);
    this.editableSiteContent.contentKeys.push(content.key);
    this.ngRedux.dispatch(ContentActions.removeContent(content));
  }
  removeFromSite(content: Content) {
    this.editableSiteContent.contentKeys = this.editableSiteContent.contentKeys.filter((contentToRemoveString) => {
      return !(contentToRemoveString === content.key);
    });
    this.editableSiteContent.contents = this.editableSiteContent.contents.filter((contentToRemoveContent: Content) => {
      return !(contentToRemoveContent.key === content.key);
    });
    this.ngRedux.dispatch(ContentActions.upsertContent(content));
  }
  cancelUploadfunction() {
    this.cancelUpload = true;
    this.showUpload = true;
    this.uploadDone = false;
  }
  removeUploadfunction() {
    this.uploadDone = false;
    this.showUpload = true;
    delete this.editableContent.url;
    delete this.editableContent.thumbnailUrl;
    delete this.editableContent.duration;
  }
  showDialog() {
    this.dialogVisable = true;
    this.cancelUpload = false;
  }
  showLightbox() {
    this.lightboxVisible = true;
  }
  hidePreviewDialog() {
    this.lightboxVisible = false;
    this.editableContent.contentType = null;
  }
  hideDialog() {
    this.dialogVisable = false;
    this.showUpload = true;
    this.cancelUpload = true;
    if (this.newContent) {
      this.newContent = false;
    }
  }
  viewContent(content: Content) {
    this.selectedContent = <any>content.contentType.toString();
    this.editableContent = Object.assign({}, content);
    this.showLightbox();
  }
  showQuestion() {
    this.questionBoxVisible = true;
  }
  hideQuestion() {
    this.questionBoxVisible = false;
  }
  viewQuestion(content: Content) {
    this.titleSwitchQuestion = false;
    this.editableContent = Object.assign({}, content);
    if (!this.editableContent.question) {
      this.editableContent.question = {
        answers: [],
        correctAnswer: null
      };
    }
    this.showQuestion();
  }
  saveSiteContent() {
    this.siteApi.pOSTSiteSiteKey(this.siteKey, this.ngRedux.getState().user.token, this.editableSiteContent).subscribe((value) => {
      this.msgs.push({ severity: 'info', summary: '', detail: 'Save Successfull' });
    }, (error) => {
      this.msgs.push({ severity: 'error', summary: 'Save Failed!', detail: error });
    });
  }
  filterUpdate() {
    this.ngRedux.dispatch(ContentActions.searchContent(this.contentFilter));
  }
}
