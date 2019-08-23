import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Project } from '../models/project';
import { CrewPosition, getPosition } from '../models/crew-positions';
import { LangService } from '../services/lang.service';




@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  myComponentId: string = 'ProjectDetails';

  // TODO: create a constructor
  projectToShow: Project = {
    id: '',
    title: '',
    date1: '',
    date2: '',
    producer: '',
    prodId: '',
    prodEmail: '',
    prodPhone: '',
    budget: 0,
    otherInfo: '',
    city: ''
  };

  neededPositions: CrewPosition[] = [];

  currentLanguage = 'en-US';
  dateFormat: string;
  projectLoaded: boolean = false;

  constructor(private db: AngularFireDatabase, private lang: LangService,
              private route: ActivatedRoute, @Inject(LOCALE_ID) language: string) {
    this.currentLanguage = language;
    this.dateFormat = lang.getDateFormat();
   }

  ngOnInit() {
    this.projectLoaded = false;
    const cityCode = this.route.snapshot.paramMap.get('cityCode');
    const id = this.route.snapshot.paramMap.get('id');
    this.getProjectDetails(cityCode, id);
  }

  getProjectDetails(cityCode: string, id: string): void {
    
    let fbProject: Observable<any> = null;
    let fbUserProject: Observable<any> = null;
    let fbNeededCrew: Observable<any> = null;
    let positionToList = {days: 0, qty: 0, rate: 0};

    this.projectToShow.id = id;
    this.projectToShow.city = cityCode;

    let projectRef = '/' + cityCode + '/projects/' + id;
    fbProject = this.db.object(projectRef).valueChanges();
    fbProject.subscribe (res => {
      this.projectToShow.title = res.title;
      this.projectToShow.date1 = res.date1;
      this.projectToShow.date2 = res.date2;
      this.projectToShow.producer = res.producer;
      this.projectToShow.prodId = res.ProdId;
      this.projectToShow.prodEmail = res.prodEmail;
      this.projectToShow.prodPhone = res.prodPhone;
      this.projectToShow.budget = res.budget;

      this.projectLoaded = true;

      let refOtherInfo = '/' + this.projectToShow.city + '/otherInfo/' + this.projectToShow.id;
      fbUserProject = this.db.object(refOtherInfo).valueChanges();
      fbUserProject.subscribe (res => {
        if (res) {
          this.projectToShow.otherInfo = res.info;
        }
      }, err => console.log (err));

      let refNeededCrew = '/' + this.projectToShow.city + '/neededCrew/' + this.projectToShow.id;
      fbNeededCrew = this.db.list(refNeededCrew).snapshotChanges();
      fbNeededCrew.subscribe (res => {
        this.neededPositions.length = 0;
        if (res) {
          res.forEach((crewMember, index) => {
            positionToList = crewMember.payload.val();
            this.neededPositions.push(new CrewPosition(crewMember.key,
              getPosition (crewMember.key, this.currentLanguage), positionToList.qty,
              positionToList.days, positionToList.rate, 0));
          });
        }
      }, err => console.log (err));

    }, err => console.log (err));
    
  }

  copyLink(): void{
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = document.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    alert (this.lang.message(this.lang.MSG_COPIED_TO_CLIPBOARD));
  }

}


