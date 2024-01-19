import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../services/http/httpservice';
import {Tag} from '../../../models/tag';
import {List} from '../../../models/list';
import {Producer} from '../../../models/producer';
import {Campaign} from '../../../models/campaign';
import {Selectable} from '../../../models/selectable';
import {AuthService} from '../../../services/http/authService';
import {Video} from '../../../models/video';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  static ACTION_CREATE = 'create';
  static ACTION_UPDATE = 'update';

  private _action: string;
  private _modelId: number;

  published = false;

  form: FormGroup;

  tagList: (Tag & Selectable)[] = [];

  ageList: List[] = [];

  genderList: List[] = [];

  paymentTypeList: List[] = [];

  producerList: Producer[] = [];

  people = 0;

  peopleMin = 0;

  peopleMax = 0;

  reward = 0;

  agree: boolean;

  fileVideo: any;
  fileVideoThumbnail: any;
  fileProducerImage: any;


  videoError: string;
  videoThumbnailError: string;
  producerImageError: string;

  constructor(
    private snackBar: MatSnackBar,
    private auth: AuthService,
    private http: HttpService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  protected refreshPeopleData(budget) {
    if (this.reward > 0) {
      this.peopleMax = Math.floor(budget / this.reward);
    }
    if (this.peopleMax < this.form.controls.peopleCtrl.value) {
      this.form.controls.peopleCtrl.setValue(this.peopleMax);
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params && (params.id)) {
        this._modelId = Number(params.id);
        this._action = VideoComponent.ACTION_UPDATE;
        this.http.title = 'Aggiorna video';
        this.agree = true;
      } else {
        this._action = VideoComponent.ACTION_CREATE;
        this.http.title = 'Nuovo video';
        this.agree = false;
      }
      this.initForm();
    });
  }

  toggleTag(id: number) {
    const tags = this.form.controls.tagCtrl.value;
    const index = tags.indexOf(id);
    if (index > -1) {
      // Deselect tag
      tags.splice(index, 1);
    } else {
      // Select tag
      tags.push(id);
    }
    this.form.controls.tagCtrl.setValue(tags);
  }


  canSubmitForm() {
    return this.form.get('agreeCtrl').value; // !== false && this.form.valid;
  }

  initForm() {
    this.form = this.formBuilder.group({
      tagCtrl: new FormControl([], []),
      campaignTitleCtrl: new FormControl('', [Validators.required]),
      campaignDescriptionCtrl: new FormControl(''),
      producerCtrl: new FormControl(''),
      producerNameCtrl: new FormControl('', [Validators.required]),
      producerDescriptionCtrl: new FormControl(''),
      producerWebsiteCtrl: new FormControl(''),
      producerImageCtrl: new FormControl(''),
      geolocationCtrl: new FormControl(''),
      budgetCtrl: new FormControl('', [Validators.required]),
      ageCtrl: new FormControl(''),
      genderCtrl: new FormControl('', [Validators.required]),
      paymentTypeCtrl: new FormControl('', [Validators.required]),
      peopleCtrl: new FormControl('0'),
      agreeCtrl: new FormControl(this._action === VideoComponent.ACTION_UPDATE, [Validators.required]),
      videoCtrl: new FormControl('', [Validators.required]),
      videoThumbnailCtrl: new FormControl(''),
    });
    this.http.getCampaign(this._modelId).subscribe((response: any) => {
      const pool = this._modelId ? response.body.pool : response.body.data;
      const form = this._modelId ? response.body.data : null;
      this.initData(pool, form);
      this.form.get('budgetCtrl').valueChanges.subscribe(value => {
        this.refreshPeopleData(value);
      });
    }, (error) => {
      this.router.navigate(['/dash/stats']);
    });
  }

  initData(pool: any, form?: any) {
    this.tagList = pool.tags;
    this.producerList = pool.producers;
    this.ageList = pool.ages;
    this.genderList = pool.genders;
    this.paymentTypeList = pool.paymentTypes;
    this.reward = pool.reward;
    if (form) {
      if (form.reward) {
        this.reward = form.reward;
      }
      this.form.controls.campaignTitleCtrl.setValue(form.title);
      this.form.controls.campaignDescriptionCtrl.setValue(form.description);
      this.form.controls.geolocationCtrl.setValue(form.geolocation);
      this.form.controls.budgetCtrl.setValue(form.budget);
      this.form.controls.tagCtrl.setValue(form.tags.map((item) => item.id));
      this.form.controls.ageCtrl.setValue(form.age);
      this.form.controls.genderCtrl.setValue(form.gender);
      this.form.controls.paymentTypeCtrl.setValue(form.paymentType);

      this.form.controls.producerCtrl.setValue(form.producer.id);
      this.form.controls.producerNameCtrl.setValue(form.producer.name);
      this.form.controls.producerDescriptionCtrl.setValue(form.producer.description);
      this.form.controls.producerWebsiteCtrl.setValue(form.producer.website);
      this.form.controls.peopleCtrl.setValue(form.people);
      this.refreshPeopleData(form.budget);
      this.form.controls.videoCtrl.setValue(form.video.id);
      if (form.video.image) {
        this.form.controls.videoThumbnailCtrl.setValue(form.video.image.id);
        this.fileVideoThumbnail = form.video.image;
      }
      this.fileVideo = form.video.file;
      if (form.producer.image) {
        this.form.controls.producerImageCtrl.setValue(form.producer.image.id);
        this.fileProducerImage = form.producer.image;
      }
      // this.form.controls.areaCtrl.setValue(form.area);
    }
  }

  selectProducer(producer?: Producer) {
    if (producer) {
      this.form.controls.producerCtrl.setValue(producer.id);
      this.form.controls.producerNameCtrl.setValue(producer.name);
      this.form.controls.producerDescriptionCtrl.setValue(producer.description);
      this.form.controls.producerWebsiteCtrl.setValue(producer.website);
      if (producer.image) {
        this.form.controls.producerImageCtrl.setValue(producer.image.id);
        this.fileProducerImage = producer.image;
      } else {
        this.form.controls.producerImageCtrl.setValue('');
        this.fileProducerImage = null;
      }
    } else {
      this.form.controls.producerCtrl.setValue('');
      this.form.controls.producerNameCtrl.setValue('');
      this.form.controls.producerDescriptionCtrl.setValue('');
      this.form.controls.producerWebsiteCtrl.setValue('');
      this.form.controls.producerImageCtrl.setValue('');
      this.fileProducerImage = null;
    }
  }

  isProducerSelected(id: number | ''): boolean {
    return String(this.form.get('producerCtrl').value) === String(id);
  }

  getModel(): Campaign {
    const producer: Producer = {
      name: this.form.get('producerNameCtrl').value,
      description: this.form.get('producerDescriptionCtrl').value,
      website: this.form.get('producerWebsiteCtrl').value,
      image: {id: this.form.get('producerImageCtrl').value},
      image_id: this.form.get('producerImageCtrl').value
    };
    const video: Video = {
      id: this.form.get('videoCtrl').value,
      thumbnail_id: this.form.get('videoThumbnailCtrl').value,
    };
    if (this.form.get('producerCtrl').value !== '') {
      producer.id = this.form.get('producerCtrl').value;
    }
    const model: Campaign = {
      title: this.form.get('campaignTitleCtrl').value,
      description: this.form.get('campaignDescriptionCtrl').value,
      budget: parseFloat(this.form.get('budgetCtrl').value),
      tags: this.form.get('tagCtrl').value,
      age: this.form.get('ageCtrl').value,
      gender: this.form.get('genderCtrl').value,
      people: parseInt(this.form.get('peopleCtrl').value),
      paymentType: this.form.get('paymentTypeCtrl').value,
      geolocation: this.form.get('geolocationCtrl').value,
      video,
      producer
    };
    if (this._modelId) {
      model.id = this._modelId;
    }
    return model;
  }

  publish() {
    const model = this.getModel();
    if (this.validateForm()) {
      if (this._action === VideoComponent.ACTION_CREATE) {
        this.http.addCampaign(model).subscribe((result: any) => {
          this.published = true;
        }, (error) => {
          this.published = false;
        });
      } else {
        this.http.updateCampaign(model).subscribe((result: any) => {
          this.published = true;
        }, (error) => {
          this.published = false;
        });
      }
    } else {
      this.snackBar.open('Controllare i campi in rosso', 'chiudi', {duration: 2000});
    }
  }

  setFileId($event, field) {
    this.form.get(field).setValue($event.id);
  }

  validateForm(): boolean {
    this.form.markAllAsTouched();
    this.videoError = !this.form.get('videoCtrl').valid ? 'Error' : null;
    this.videoThumbnailError = !this.form.get('videoThumbnailCtrl').valid ? 'Error' : null;
    this.producerImageError = !this.form.get('producerImageCtrl').valid ? 'Error' : null;

    return this.form.valid;
  }

  updateGeolocation($event) {
    this.form.get('geolocationCtrl').setValue($event.formatted_address);
    console.log(this.form.get('geolocationCtrl').value);
  }
}
