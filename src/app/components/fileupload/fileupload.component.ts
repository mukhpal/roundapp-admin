import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../services/http/authService';
import {HttpService} from '../../services/http/httpservice';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit {

  @Input() set fileData(data) {
    this.file = data;
  }

  @Input() set fileType(type) {
    this.type = type;
    if (typeof this.allowedExtensions === 'undefined') {
      this.allowedExtensions = this.defaultAllowedExtensions[this.type];
    }
  }

  @Input() set fileExtensions(extensions) {
    this.allowedExtensions = extensions;
  }

  @Input() set fileMaxSize(max) {
    this.maxFileSize = max;
  }

  @Input() set fileCategory(category) {
    this.category = category;
  }

  @Input() set errorMessage(message: string) {
    this.error = message;
  }

  @Output() fileSelected = new EventEmitter<any>();
  @Output() uploadSuccess = new EventEmitter<any>();
  @Output() deleteSuccess = new EventEmitter<any>();

  private basePath = environment.urlBase;
  private _path: any = {
    saveUrl: this.basePath + 'files/{category}',
    removeUrl: this.basePath + 'files/{category}/delete/{uuid}',
  };

  defaultAllowedExtensions = {
    video: '.mp4,.3gpp,.ogg,.MP2T,.x-msvideo,.x-ms-wmv,.mpeg',
    image: '.jpg,.jpeg,.bmp,.x-windows-bmp,.png,.gif,.x-icon'
  };

  get path() {
    return {
      saveUrl: this._path.saveUrl.replace('{category}', this.category),
      removeUrl: this._path.removeUrl.replace('{category}', this.category)
    };
  }

  file: any;
  type: string;
  allowedExtensions: any;
  maxFileSize: number;
  category: string;
  progress: number;
  info = false;
  error: string;

  constructor(
    private auth: AuthService,
    private http: HttpService
  ) {
  }

  ngOnInit(): void {

  }


  public addHeaders(args: any) {
    const user = this.auth.getUser();
    args.currentRequest.setRequestHeader('Authorization', 'Bearer ' + user.access_token);
  }

  public prepareRequest(args: any, params?: any) {
    this.addHeaders(args);
    if (params) {
      args.customFormData = params;
    }
    console.log(args.customFormData);
  }

  deleteFile() {
    const file = this.file;
    if (file) {
      return this.http.deleteFile(file.type, file.uuid).subscribe((response: any) => {
        this.file = null;
        this.progress = null;
        this.deleteSuccess.emit(file);
      }, (error) => {});
    }
    return false;
  }

  showInfo($event) {
    $event.stopPropagation();
    this.info = true;
  }

  hideInfo($event) {
    $event.stopPropagation();
    this.info = false;
  }

  onUploading($event) {
    this.prepareRequest($event, [{category: this.category}]);
    console.log('onUploading');
  }
  onRemoving($event) {
    this.prepareRequest($event, [{category: this.category}]);
    console.log('onRemoving');
  }
  onProgress($event) {
    console.log('onProgress');
    this.progress = Math.ceil(($event.e.loaded / $event.e.total) * 100);
  }
  onUploadSuccess($event) {
    let video: any;
    try {
      console.log($event);
      const json = JSON.parse($event.e.target.response);
      console.log(json);
      if (this.type === 'video') {
        video = json.data;
        this.file = json.data.file;
      }
      else {
        this.file =  json.data;
      }
    }
    catch (e) {
      console.error('Unable to parse response');
      console.log(e);
    }
    console.log($event);
    console.log('onUploadSuccess');
    this.progress = null;
    const emitData: any = {
      event: $event,
      file: this.file,
    };
    if (video) {
      emitData.video = video;
    }
    this.uploadSuccess.emit(emitData);
  }
  onUploadFailure($event) {
    console.log('onUploadFailure');
    this.progress = null;
  }
  onSelect($event) {
    console.log('onSelect');
    this.progress = 0;
    this.fileSelected.emit({});
  }
}
