import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

  static dateToISO(date) {
    let day = date.getDate(date);
    let month = date.getMonth(date) + 1;
    let year = date.getFullYear(date);

    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;

    return `${year}-${month}-${day}`;
  }

  static validateDatesInterval (date1InMills, date2InMills) {
    if (typeof (date1InMills) != "number" || typeof (date2InMills) != "number")
      throw new Error ('Date parameters must be a number');

    return date2InMills >= date1InMills ? true : false;
  }

  static textToDate(text) {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(text))
      throw new Error('Date must be yyyy-mm-dd');
    return new Date(...text.split('-').map((item,indice) => item - indice % 2));
  }

  static getNumberOfDays (date1ISO, date2ISO) {
    let d1 = Utils.textToDate (date1ISO);
    let d2 = Utils.textToDate (date2ISO);
    let days = Math.round (((d2.getTime() - d1.getTime()) / 86400000) + 1);
    return days > 0 ? days : 1;
  }

  static setFormDefaultValues (project) {
    let formDate = new Date();
    formDate.setDate(formDate.getDate() + 1);

    project.id = '';
    project.title ='';
    project.date1 = Utils.dateToISO(formDate);
    project.date2 = project.date1;
    project.prodPhone = '';
    project.budget = 0;
    project.otherInfo = '';
    project.city = '';
  }

}
