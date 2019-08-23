import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  myComponentId: string = 'Help';

  faqList: Array<Object> = [];

  constructor(private db: AngularFireDatabase, @Inject(LOCALE_ID) language: string) { 
    this.getFAQ(language);
  }

  ngOnInit() {
  }

  getFAQ(language: string) {
    let refFAQ = '/zFAQ/web/';
    let fbFAQ: Observable<any[]> = this.db.list(refFAQ).valueChanges();

    let faqSubscription = fbFAQ.subscribe (res => {
      this.faqList.length = 0;
      res.forEach (faqItem => {
        this.faqList.push(faqItem[language]);
      })
      faqSubscription.unsubscribe();
    }, err => {
      console.log (err);
    });
  }
}
