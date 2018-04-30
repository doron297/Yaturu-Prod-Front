import { Component, OnInit, ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';
import { AppState } from '../../store/appState';
import { Content } from '../../shared/swagger/model/Content';
import { ContentApi } from '../../shared/swagger/api/ContentApi';
import * as ContentActions from '../../store/content/content.ac';
import * as UserActions from '../../store/user/user.ac';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { LoaderComponent } from '../generalComponents/loader.component';
import { Message } from 'primeng/primeng';
let $ = window['$'];

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

@Component({
  selector: 'app200-content-page',
  templateUrl: './contentPage.html',
  styleUrls: ['./contentPage.scss'],
  providers: [ContentApi],
  directives: [LoaderComponent],
  pipes: [DurationPipe]
})
export class ContentPageComponent implements OnInit {
  @select(['content', 'filteredContent']) content: Array<Content>;
  dialogVisable = false;
  lightboxVisible = false;
  questionBoxVisible = false;
  editableContent: Content = {};
  newContent: boolean = false;
  contentFilter = '';
  cloudinaryImage: any;
  showUpload: boolean = true;
  showUploadImage: boolean = true;
  cancelUpload: boolean = false;
  uploadDone: boolean = false;
  titleSwitchQuestion: boolean = false;
  titleSwitchContent: boolean = false;
  msgs: Message[] = [];
  loaderOn: Boolean = true;
  contentTypes: SelectItem[] = [{ label: 'Select Type', value: null }, { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' }, { label: 'Text', value: 'text' },
  { label: 'Coupon', value: 'cupon' }, { label: 'Image', value: 'image' },
  { label: 'AR', value: 'ar_application' }];
  selectedContent: string;
  constructor(private ngRedux: NgRedux<AppState>, private contentApi: ContentApi,
    private router: Router, private applicationRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) {
    if (this.isAuthenticated() === false) {
      this.router.navigate(['login']);
    }
  }
  isAuthenticated(): boolean {
    return UserActions.isAuthenticated(this.ngRedux.getState(), this.ngRedux.dispatch);
  }
  ngOnInit() {
    if (this.isAuthenticated()) {
      this.contentApi.gETContent(this.ngRedux.getState().user.token).subscribe((response: any) => {
        if (response.items) {
          this.ngRedux.dispatch(ContentActions.loadContent(response.items));
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
          this.editableContent.url = data.result.secure_url;
          if (this.selectedContent === 'video') {
            let tmpUrlThumbnail = data.result.secure_url.split('.');
            tmpUrlThumbnail[tmpUrlThumbnail.length - 1] = '';
            let strChange = tmpUrlThumbnail[2].split('/');
            strChange[4] = 'vc_auto';
            tmpUrlThumbnail[2] = strChange.join('/');
            this.editableContent.url = tmpUrlThumbnail.join('.') + 'webm';
            this.editableContent.thumbnailUrl = tmpUrlThumbnail.join('.') + 'jpg';
            this.editableContent.duration = data.result.duration;
          } else if (this.selectedContent === 'audio') {
            this.editableContent.duration = data.result.duration;
          } else if (this.selectedContent === 'text') {
            this.editableContent.thumbnailUrl = data.result.secure_url;
          } else if (this.selectedContent === 'cupon' || this.selectedContent === 'image') {
            this.editableContent.thumbnailUrl = data.result.secure_url;
          } else {
            this.msgs.push({ severity: 'error', summary: 'Failed Upload!', detail: e });
            return;
          }
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

      $('.upload_image').append($.cloudinary.unsigned_upload_tag('cet7owh3',
        { cloud_name: 'maatayem' }));
      $('.cloudinary_fileupload').unsigned_cloudinary_upload('cet7owh3',
        { cloud_name: 'maatayem' },
        { multiple: false }
      ).bind('cloudinarydone', (e, data) => {
        if(!this.editableContent.url && this.selectedContent === 'audio') return;
        if (data.textStatus === 'success') {
          this.editableContent.thumbnailUrl = data.result.secure_url;
          $('.bar').css('width', '100%');
          this.uploadDone = true;
        }
      }).bind('cloudinaryprogress', (e, data) => {
        if(!this.editableContent.url && this.selectedContent === 'audio') return;
        $('.bar').css('width', '0');
        // if (this.showUploadImage) {
        //   this.showUploadImage = false;
        // }
        if (this.cancelUpload) {
          this.uploadDone = false;
          data.xhr().abort();
          // this.showUploadImage = true;
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
    // this.showUploadImage = true;
    this.uploadDone = false;
  }
  removeUploadfunction() {
    this.uploadDone = false;
    this.showUpload = true;
    // this.showUploadImage = true;
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
  addContent() {
    this.titleSwitchContent = true;
    this.selectedContent = null;
    this.newContent = true;
    this.editableContent = {
      key: Date.now().toString()
    };
    this.showDialog();
  }
  addQuestion() {
    this.titleSwitchQuestion = true;
    this.newContent = true;
    this.editableContent = {
      key: Date.now().toString(),
      contentType: Content.ContentTypeEnum.Question
    };

    this.editableContent.question = {
      answers: [],
      correctAnswer: null
    };

    this.showQuestion();
  }
  saveContent() {
    this.editableContent.contentType = <any>this.selectedContent;
    if (this.newContent) {
      this.contentApi.pUTContent(this.ngRedux.getState().user.token,
        this.editableContent).subscribe((response) => {
          this.editableContent.key = response.key;
          this.ngRedux.dispatch(ContentActions.upsertContent(this.editableContent));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Content Created!' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Failed To Create Content!', detail: error });
        });
    } else {
      this.contentApi.pOSTContentContentKey(this.editableContent.key,
        this.ngRedux.getState().user.token, this.editableContent).subscribe((value) => {
          this.ngRedux.dispatch(ContentActions.upsertContent(this.editableContent));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Content Saved!!' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Failed To Save Content!', detail: error });
        });
    }
    this.hideDialog();
    this.hideQuestion();
  }
  editContent(content: Content) {
    this.titleSwitchContent = false;
    this.selectedContent = <any>content.contentType;
    this.editableContent = Object.assign({}, content);
    this.showDialog();
  }
  viewContent(content: Content) {
    this.selectedContent = <any>content.contentType.toString();
    this.editableContent = Object.assign({}, content);
    this.showLightbox();
  }
  showQuestion() {
    this.selectedContent = 'question';
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
  removeContent() {
    if (confirm(`Are you sure you want to remove ${this.editableContent.name}? `)) {
      this.contentApi.dELETEContentContentKey(this.editableContent.key,
        this.ngRedux.getState().user.token).subscribe(() => {
          this.ngRedux.dispatch(ContentActions.removeContent(this.editableContent));
          this.msgs.push({ severity: 'info', summary: '', detail: 'Content Deleted!!' });
        }, (error) => {
          this.msgs.push({ severity: 'error', summary: 'Failed To Delete Content!', detail: error });
        });
      this.hideDialog();
      this.hideQuestion();
    }
  }
  filterUpdate() {
    this.ngRedux.dispatch(ContentActions.searchContent(this.contentFilter));
  }
}
