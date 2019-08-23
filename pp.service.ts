import { Injectable } from '@angular/core';

import { Project } from './project';




@Injectable()
export class PpService {

  constructor() { }

  createProject(project, positions): void {
    console.log ("PpService projects>> " + JSON.stringify(project));
    console.log ("PpService positions>> " + JSON.stringify(positions));
  }

}
