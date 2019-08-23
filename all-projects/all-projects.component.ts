import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { City, getAllCities, getCity } from '../models/city';
import { CrewPosition, getPosition, getAllPositions, crewBitsAllPositions, getBits } from '../models/crew-positions';
import { Project } from '../models/project';
import { LangService } from '../services/lang.service';
import { Utils } from '../utils/utils';


@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.css',
              '../edit-projects/form-project.css'
  ]
})
export class AllProjectsComponent implements OnInit {

  myComponentId: string = 'AllProjects';

  fbCityProjects: Observable<any[]>;
  projectsList: Project[] = [];
  projectsInThisCity: number = 0;
  neededPositions: CrewPosition[] = [];
  allPositions: CrewPosition[] = [];
  selectedPositionCode: string = '';
  selectedPositionBits: number = crewBitsAllPositions();

  currentLanguage = 'en-US';
  allCities: City[] = [];
  selectedCity = new City ('zz', 'zz', '', '');

  dateFormat: string;
  dateNow: number;
  myCity: string = 'myCity';
  myPosition: string = 'myPosition';

  constructor(private db: AngularFireDatabase, private lang: LangService, @Inject(LOCALE_ID) language: string) {
    this.dateNow = Date.now();
    this.currentLanguage = language;
    this.allCities = getAllCities(this.currentLanguage);
    this.allPositions = getAllPositions(this.currentLanguage);
    this.dateFormat = lang.getDateFormat();
    if (localStorage.getItem(this.myCity)) this.onSelectCity(localStorage.getItem(this.myCity));
    if (localStorage.getItem(this.myPosition)) this.onSelectPosition(localStorage.getItem(this.myPosition));
   }

  ngOnInit() {
  }

  getProjectsByCity(cityCode: string): void {
    let refProjects = '/' + cityCode + '/projects/';
    this.fbCityProjects = this.db.list(refProjects).snapshotChanges();

    this.fbCityProjects.subscribe(res => {
      this.projectsList.length = 0;
      this.projectsInThisCity = res.length;
      res.forEach (project => {
        let auxProject = project.payload.val();
        if (this.dateNow <= auxProject.date2) {
          let projectToList: Project = {
            id: project.key,
            title: auxProject.title,
            date1: Utils.dateToISO(new Date(auxProject.date1)),
            date2: Utils.dateToISO(new Date(auxProject.date2)),
            producer: auxProject.producer,
            prodId: auxProject.prodId,
            prodEmail: auxProject.prodEmail,
            prodPhone: auxProject.prodPhone,
            budget: auxProject.budget,
            otherInfo: '',
            city: auxProject.city
          }
          projectToList["crewBits"] = auxProject.crewBits;
          this.projectsList.push(projectToList);
        }
      });
    }, err => {
      console.log (err);
    });
  }

  onSelectCity(cityCode): void {
    this.selectedCity.cityCode = cityCode;
    this.selectedCity.cityName = getCity (cityCode, this.currentLanguage);
    this.getProjectsByCity(cityCode);
    localStorage.setItem (this.myCity, cityCode);
  }  

  onSelectPosition(positionCode): void {
    this.selectedPositionCode = positionCode;
    this.selectedPositionBits = positionCode ? getBits(positionCode) : crewBitsAllPositions();
    localStorage.setItem (this.myPosition, positionCode);
  } 

}
