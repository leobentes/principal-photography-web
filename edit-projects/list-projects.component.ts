import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserService } from '../services/user.service';
import { Utils } from '../utils/utils';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project';
import { Router } from '@angular/router';
import { PpService } from '../services/pp.service';
import { LangService } from '../services/lang.service';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.css']
})
export class ListProjectsComponent implements OnInit {

  myComponentId: string = 'ListProjects';

  currentLanguage: string;
  dateFormat: string;

  fpUserProjects: Observable<any[]>;
  fbUserProject: Observable<any>;
  projectsList: Project[] = [];
  projectToEdit: Project = null;
  userProjects: string[] = [];

  editMode: boolean = false;

  constructor(private db: AngularFireDatabase, private userService: UserService,
              private router: Router, private ppService: PpService, 
              private lang: LangService, @Inject(LOCALE_ID) language: string) {

    this.currentLanguage = language;
    this.dateFormat = lang.getDateFormat();
    this.getProjectsByUSer();
  }

  ngOnInit() {
  }

  getProjectsByUSer(): void {
    let refOwners = '/projOwners/' + this.userService.getCurrentUserId();
    this.fpUserProjects = this.db.list(refOwners).snapshotChanges();

    this.fpUserProjects.subscribe(res => {
      this.projectsList.length = 0;
      res.forEach (toProject => {
        let refProjects = '/' + toProject.payload.val() + '/projects/' + toProject.key;
        this.fbUserProject = this.db.object(refProjects).valueChanges();

        this.fbUserProject.subscribe (proj => {
          if (proj) {
            // TODO: create a constructor
            let auxProject: Project = {
              id: toProject.key,
              title: proj.title,
              date1: Utils.dateToISO(new Date(proj.date1)),
              date2: Utils.dateToISO(new Date(proj.date2)),
              producer: proj.producer,
              prodId: proj.prodId,
              prodEmail: proj.prodEmail,
              prodPhone: proj.prodPhone,
              budget: proj.budget,
              otherInfo: '',
              city: proj.city
            }
            this.projectsList.push(auxProject);
          }
        }, err => console.log (err));
      });
    }, err => {
      console.log (err);
    });
  }
  
  editProject(projectToEdit: Project): void{
    this.projectToEdit = projectToEdit;
    this.editMode = true;
    this.myComponentId='EditProject';
  }

  deleteProject(projectToDelete: Project): void{
    if(confirm(this.lang.message(this.lang.MSG_DELETE_PROJECT, projectToDelete.title))){
      let result = this.ppService.deleteProject(projectToDelete.id, projectToDelete.city, projectToDelete.prodId);
      result.then (res => {
        alert (this.lang.message(this.lang.MSG_PROJECT_DELETED, projectToDelete.title));
      }).catch (err => {
        alert (this.lang.message(this.lang.MSG_ERROR_DELETING_PROJECT, projectToDelete.title));
      })
      this.projectsList.length = 0;
    }
  }

  onEdited(edited: boolean): void{
    this.getProjectsByUSer();
    this.editMode = false;
    this.myComponentId='ListProjects';
  }

  copyLink(project: Project): void{
    let link = document.location.origin + "/filming/" + project.city + "/" + project.id;

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    alert (this.lang.message(this.lang.MSG_COPIED_TO_CLIPBOARD));
  }

}
