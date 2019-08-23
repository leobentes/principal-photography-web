import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Utils } from '../utils/utils';
import { LangService } from './lang.service';
import { CrewPosition } from '../models/crew-positions';

import { getBits } from '../models/crew-positions';

@Injectable()
export class PpService {

  _projectDbEntry = {
    "title" : "",
    "date1" : 0,
    "date2" : 0,
    "producer" :  "",
    "prodId" : "",
    "prodEmail" :  "",
    "prodPhone" :  "",
    "budget" : 0,
    "crewBits": 0,
    "city": ""
  };

  neededCrewDbEntry = [];

  dbRootRef: AngularFireDatabase;
  rootRef: AngularFireObject<any>;

  fbProjOwners= '/projOwners/';
  userProjects: Observable<any[]>;

  constructor(db: AngularFireDatabase, private lang: LangService) {
    this.dbRootRef = db;
  }

  validateProjectForm(project: Project, neededCrew: CrewPosition[]){
    // TODO: validate all other fields

    // Using textToDate plus getTime() ensures the milliseconds value considers
    // local time. Using Date.parse would consider UTC
    let date1 = Utils.textToDate(project.date1).getTime();
    let date2 = Utils.textToDate(project.date2).getTime();

    if (!Utils.validateDatesInterval (date1, date2)){
        alert (this.lang.message(this.lang.MSG_ERROR_DATE_INTERVAL));
        return false;
    }

    if (!neededCrew.length){
      alert (this.lang.message(this.lang.MSG_ERROR_MISSING_CREW_POSITION));
      return false;
    }

    if (!project.city.length){
      alert (this.lang.message(this.lang.MSG_SELECT_CITY));
      return false;
    }     

    return true;
  }

  async createProject(project: Project, neededCrew: CrewPosition[]) {
    let city = project.city;
    let fbProjects = city + '/projects/';
    let fbOtherInfo = city + '/otherInfo/';
    let fbNeededCrew = city + '/neededCrew/';
    let fbProjectOwners = '/projOwners/';

    this.rootRef = this.dbRootRef.object('/');

    this._projectDbEntry.title = project.title;
    this._projectDbEntry.producer = project.producer;
    this._projectDbEntry.prodId = project.prodId;
    this._projectDbEntry.prodEmail = project.prodEmail;
    this._projectDbEntry.prodPhone = project.prodPhone;
    this._projectDbEntry.budget = project.budget;
    this._projectDbEntry.city = project.city;

    // Using textToDate plus getTime() ensures the milliseconds value considers
    // local time. Using Date.parse would consider UTC
    this._projectDbEntry.date1 = Utils.textToDate(project.date1).getTime();
    this._projectDbEntry.date2 = Utils.textToDate(project.date2).getTime();
    
    let neededCrewBits = 0;
    this.neededCrewDbEntry.length = 0;
    let newKey = this.dbRootRef.createPushId();

    let projectToCreate = {};

    for (let i = 0; i < neededCrew.length; ++i){
      let crewCode = neededCrew[i].code;
      // TODO: Parametrizar as keys "days", "qty" e "rate"?
      this.neededCrewDbEntry.push({days: neededCrew[i].days, qty: neededCrew[i].quantity, rate: neededCrew[i].rate})
      projectToCreate[fbNeededCrew + newKey + '/' + crewCode] = this.neededCrewDbEntry[i];
      neededCrewBits = neededCrewBits + getBits(crewCode);
    }

    this._projectDbEntry.crewBits = neededCrewBits;

    projectToCreate[fbProjects + newKey] = this._projectDbEntry;
    projectToCreate[fbOtherInfo + newKey] = {info: project.otherInfo};
    projectToCreate[fbProjectOwners + project.prodId + '/' + newKey ] = this._projectDbEntry.city;

    try {
        await this.rootRef.update(projectToCreate);
    } catch (err) {
        throw new Error(`Project not saved. Reason: ${err}`);
    }

  }

  async updateProject(project: Project, neededCrew: CrewPosition[]) {
    let city = project.city;
    let fbProjects = city + '/projects/';
    let fbOtherInfo = city + '/otherInfo/';
    let fbNeededCrew = city + '/neededCrew/';
    let fbProjectOwners = '/projOwners/';

    this.rootRef = this.dbRootRef.object('/');

    this._projectDbEntry.title = project.title;
    this._projectDbEntry.producer = project.producer;
    this._projectDbEntry.prodId = project.prodId;
    this._projectDbEntry.prodEmail = project.prodEmail;
    this._projectDbEntry.prodPhone = project.prodPhone;
    this._projectDbEntry.budget = project.budget;
    this._projectDbEntry.city = project.city;

    // Using textToDate plus getTime() ensures the milliseconds value considers
    // local time. Using Date.parse would consider UTC
    this._projectDbEntry.date1 = Utils.textToDate(project.date1).getTime();
    this._projectDbEntry.date2 = Utils.textToDate(project.date2).getTime();
    
    let neededCrewBits = 0;
    this.neededCrewDbEntry.length = 0;
    let currentKey = project.id;
    console.log (currentKey);

    let projectToUpdate = {};

    for (let i = 0; i < neededCrew.length; ++i){
      let crewCode = neededCrew[i].code;
      this.neededCrewDbEntry.push({days: neededCrew[i].days, qty: neededCrew[i].quantity, rate: neededCrew[i].rate})
      projectToUpdate[fbNeededCrew + currentKey + '/' + crewCode] = this.neededCrewDbEntry[i];
      neededCrewBits = neededCrewBits + getBits(crewCode);
    }

    this._projectDbEntry.crewBits = neededCrewBits;

    projectToUpdate[fbProjects + currentKey] = this._projectDbEntry;
    projectToUpdate[fbOtherInfo + currentKey] = {info: project.otherInfo};
    projectToUpdate[fbProjectOwners + project.prodId + '/' + currentKey ] = this._projectDbEntry.city;

    console.log ('Updating on firebase...');
    try {
        // It's necessary to delete the current crew list before recording the updated one
        // It didn't work using this.rootRef.set() instead of this.rootRef.update()
        // TODO: Find a way to do it in just one operation (like set) instead of two (remove + update)
        let fbCrewToDelete: AngularFireObject<any> = this.dbRootRef.object(fbNeededCrew + currentKey);
        console.log ("Erasing " + fbNeededCrew + currentKey);
        await fbCrewToDelete.remove();

        await this.rootRef.update(projectToUpdate);
        console.log ('Project sucessfully updated', projectToUpdate);
    } catch (err) {
        throw new Error(`Project not saved. Reason: ${err}`);
    }

  }

  async deleteProject(projectId: string, city: string, producerId: string) {

    let deleteProjectRef: AngularFireObject<any> = this.dbRootRef.object(city + '/projects/' + projectId);
    let deleteOtherInfoRef: AngularFireObject<any> = this.dbRootRef.object(city + '/otherInfo/' + projectId);
    let deleteNeedCrewRef: AngularFireObject<any> = this.dbRootRef.object(city + '/neededCrew/' + projectId);
    let deleteOnwerRef: AngularFireObject<any> = null;

    console.log ('Removing from firebase...');

    // ProducerId null means that we are deleting a project that "moved" from one city to another 
    if (producerId) {
      deleteOnwerRef = this.dbRootRef.object('/projOwners/' + producerId + '/' + projectId);
      return Promise.all ([
        deleteProjectRef.remove(),
        deleteOtherInfoRef.remove(),
        deleteNeedCrewRef.remove(),
        deleteOnwerRef.remove()
      ]);
    } else {
      return Promise.all ([
        deleteProjectRef.remove(),
        deleteOtherInfoRef.remove(),
        deleteNeedCrewRef.remove()
      ]);
    }

  }
}
