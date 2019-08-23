import { Pipe, PipeTransform } from '@angular/core';

export class Project {
  id: string;
  title: string;
  date1: string;
  date2: string;
  producer: string;
  prodId: string;
  prodEmail: string;
  prodPhone: string;
  budget: number;
  otherInfo: string;
  city: string
}

@Pipe({
  name: 'filterProjectsByPosition',
  pure: false
})
export class filterProjectsByPositionPipe implements PipeTransform {
  transform(projects: any[], crewBits: number): Project[] {
    if (projects.length){
      return projects.filter (proj => {
          return (proj.crewBits & crewBits);
      });
    }
  }
}
