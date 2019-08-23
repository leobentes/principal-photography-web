import { Component, OnInit, Input, Output, LOCALE_ID, Inject, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { CrewPosition, getPosition, getAllPositions } from '../models/crew-positions';
import { City, getAllCities } from '../models/city';
import { Utils } from '../utils/utils';
import { PpService } from '../services/pp.service';
import { LangService } from '../services/lang.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.css',
              './form-project.css'
  ]
})
export class EditProjectComponent implements OnInit {

  myComponentId: string = 'EditProject';

  @Input() projectToEdit: Project = null;
  @Output() onEdited = new EventEmitter<boolean>();


  currentLanguage = 'en-US';
  db: AngularFireDatabase;
  fbUserProject: Observable<any>;
  fbNeededCrew: Observable<any>;
  neededPositions: CrewPosition[] = [];
  positionToList = {days: 0, qty: 0, rate: 0};

  allPositions: CrewPosition[] = [];
  selectedPosition = new CrewPosition ('', '', 1, 1, 0, 0);
  selectPosition: boolean = true;
  inputPosition: boolean = false;

  allCities: City[] = [];

  currentCity: string = null;


  constructor(private route: ActivatedRoute, db: AngularFireDatabase, @Inject(LOCALE_ID) language: string, 
              private ppService: PpService, private lang: LangService, private router: Router){ 
    this.db = db;
    this.currentLanguage = language;
    this.allPositions = getAllPositions(this.currentLanguage);
    this.allCities = getAllCities(this.currentLanguage);
  }

  ngOnInit() {
    this.currentCity = this.projectToEdit.city;
    let refOtherInfo = '/' + this.currentCity + '/otherInfo/' + this.projectToEdit.id;
    this.fbUserProject = this.db.object(refOtherInfo).valueChanges();
    this.fbUserProject.subscribe (res => {
      if (res) {
        this.projectToEdit.otherInfo = res.info;
      }
    }, err => console.log (err));

    let refNeededCrew = '/' + this.currentCity + '/neededCrew/' + this.projectToEdit.id;
    this.fbNeededCrew = this.db.list(refNeededCrew).snapshotChanges();
    this.fbNeededCrew.subscribe (res => {
      this.neededPositions.length = 0;
      if (res) {
        res.forEach((crewMember, index) => {
          this.positionToList = crewMember.payload.val();
          this.neededPositions.push(new CrewPosition(crewMember.key,
            getPosition (crewMember.key, this.currentLanguage), this.positionToList.qty,
            this.positionToList.days, this.positionToList.rate, 0));
        });
      }
    }, err => console.log (err));
  }

  onSelectCity(cityCode): void {
    this.projectToEdit.city = cityCode;
    cityCode='';
 }

  onSelectPosition(positionCode): void {
    this.selectedPosition.description = getPosition(positionCode, this.currentLanguage);
    this.selectedPosition.days =
          Utils.getNumberOfDays (this.projectToEdit.date1, this.projectToEdit.date2);
    this.selectPosition = false;
    this.inputPosition = true;
  } 

  editPosition(positionToEdit: CrewPosition): void {
    this.deletePosition(positionToEdit);
    this.selectedPosition = positionToEdit;
    this.selectPosition = false;
    this.inputPosition = true;
  } 


  addPosition(positionToAdd: CrewPosition): void {
     if (positionToAdd) {
       this.neededPositions.push(new CrewPosition(positionToAdd.code,
         positionToAdd.description, positionToAdd.quantity,
         positionToAdd.days, positionToAdd.rate, 0));
     }
     this.inputPosition = false;
     this.selectPosition = true;
     this.selectedPosition.code = '';
  }

  deletePosition(positionToDelete: CrewPosition): void {
    if (positionToDelete) {
      for (let i = 0; i < this.neededPositions.length; i++){
        if (this.neededPositions[i].code == positionToDelete.code){
            this.neededPositions.splice(i, 1);
            return;
        }
      }
    }
    return;
  }

  updateProject(projectToUpdate: Project, positions: CrewPosition[]): void {
    if (this.ppService.validateProjectForm(projectToUpdate, positions))
    {
      let result = this.ppService.updateProject(projectToUpdate, positions);
      result.then (res => {
        if (this.currentCity != this.projectToEdit.city){
          this.ppService.deleteProject(projectToUpdate.id, this.currentCity, null);
        }
        alert (this.lang.message(this.lang.MSG_PROJECT_UPDATED, projectToUpdate.title));
        this.onEdited.emit(true);
        this.router.navigateByUrl('/edit');
      }).catch (err => {
        alert (this.lang.message(this.lang.MSG_ERROR_SAVING_PROJECT, projectToUpdate.title));
      });
    }
  }

  cancelUpdate(): void {
    if(confirm(this.lang.message(this.lang.MSG_CANCEL_UPDATE))) {
      this.onEdited.emit(true);
      this.router.navigateByUrl('/edit');
    } 
  }
}
