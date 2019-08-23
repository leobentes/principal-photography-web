import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Project } from '../models/project';

import { PpService } from '../services/pp.service';
import { Utils } from '../utils/utils';
import { AngularFireAuth } from 'angularfire2/auth';
import { UserService } from '../services/user.service';
import { LangService } from '../services/lang.service';
import { Router } from '@angular/router';

import { CrewPosition } from '../models/crew-positions';
import { getAllPositions } from '../models/crew-positions';
import { getPosition } from '../models/crew-positions';
import { MOCK_PROJECT } from '../models/mock-projects';

import { City, getAllCities } from '../models/city';
import { FormGroup } from '@angular/forms/';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css',
              '../edit-projects/form-project.css'
  ]
})
export class NewProjectComponent implements OnInit {

    myComponentId: string = 'NewProject';

    // TODO: create a constructor
    project: Project = {
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
    //project = MOCK_PROJECT;

    allPositions: CrewPosition[] = [];
    neededPositions: CrewPosition[] = [];
    selectedPosition = new CrewPosition ('', '', 1, 1, 0, 0);
    selectPosition: boolean = true;
    inputPosition: boolean = false;

    allCities: City[] = [];

    currentLanguage = 'en-US';

    constructor(private ppService: PpService, private afAuth: AngularFireAuth, 
                private userService: UserService, @Inject(LOCALE_ID) language: string,
                private lang: LangService, private router: Router) {
      this.currentLanguage = language;
      console.log (`language for new project = ${this.currentLanguage}`);
      this.allPositions = getAllPositions(this.currentLanguage);
      this.allCities = getAllCities(this.currentLanguage);
      Utils.setFormDefaultValues (this.project);
    }

    ngOnInit() {
      this.setCurrentUserInfo ();
    }

    setCurrentUserInfo() {
      this.project.producer = this.userService.getCurrentUserName();
      this.project.prodEmail = this.userService.getCurrentUserEmail();
      this.project.prodId = this.userService.getCurrentUserId();
    }

    addPosition(positionToAdd: CrewPosition): void {
       if (positionToAdd) {
         this.neededPositions.push(new CrewPosition(positionToAdd.code,
           positionToAdd.description, positionToAdd.quantity,
           positionToAdd.days, positionToAdd.rate, 0));
       }
       this.inputPosition = false;
       this.selectPosition = true;
       // Set code to null in order to reset the dropdown list
       this.selectedPosition.code = '';
    }

    editPosition(positionToEdit: CrewPosition): void {
      this.deletePosition(positionToEdit);
      this.selectedPosition = positionToEdit;
      this.selectPosition = false;
      this.inputPosition = true;
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


    onSelectPosition(positionCode): void {
       // TODO: This function is called once again the form is reset, with a null parameter
       if (!positionCode) return;

       this.selectedPosition.description = getPosition(positionCode, this.currentLanguage);
       this.selectedPosition.days =
              Utils.getNumberOfDays (this.project.date1, this.project.date2);
       this.selectPosition = false;
       this.inputPosition = true;
    }


    onSelectCity(cityCode): void {
       this.project.city = cityCode;
       cityCode='';
    }

    createProject(projectToSave: Project, positions: CrewPosition[], currentForm: FormGroup): void {

      if (this.ppService.validateProjectForm(projectToSave, positions))
      {
        let result = this.ppService.createProject(projectToSave, positions);
        result.then (res => {
          alert (this.lang.message(this.lang.MSG_PROJECT_CREATED, projectToSave.title));
          this.neededPositions.length = 0;
          
          this.selectPosition = true;
          this.inputPosition = false;
          let prodPhoneTemp = projectToSave.prodPhone;
          Utils.setFormDefaultValues (this.project);
          this.setCurrentUserInfo ();
          currentForm.controls['title'].markAsPristine();
          currentForm.controls['phone'].markAsPristine();
          this.project.prodPhone = prodPhoneTemp;
          this.router.navigateByUrl('/edit');
        }).catch (err => {
          alert (this.lang.message(this.lang.MSG_ERROR_SAVING_PROJECT, projectToSave.title));
        });
      }
    }

    clearForm(): void {
      if(confirm(this.lang.message(this.lang.MSG_CLEAR_FORM))) {
        this.neededPositions.length = 0;
        Utils.setFormDefaultValues (this.project);
      }
    }

}
