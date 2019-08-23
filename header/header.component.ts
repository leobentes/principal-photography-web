import { Component, OnInit, Input } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LangService } from '../services/lang.service';
import { NewProjectComponent } from '../new-project/new-project.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName: string = '';
  userEmail: string = '';
  currentLanguage: string = '';

  @Input() currentComponent: string = '';
  @Input() subTitle: string = '';

  constructor(public afAuth: AngularFireAuth, private router: Router, 
              private userService: UserService, private lang: LangService) { 
  }

  ngOnInit() {
    this.currentLanguage = this.lang.getLanguage();
  }

  goTo(componentToGo){
    let go = true;
    if (this.currentComponent == 'NewProject' || this.currentComponent == 'EditProject'){
      if(!confirm(this.lang.message(this.lang.MSG_QUIT_FORM))) {
        go = false;
      }
    }
    if (go) {
      this.router.navigateByUrl(componentToGo);
    }

  }
  
  // TODO: Transform login component into a service
  logout() {
    this.afAuth.auth.signOut();
    this.userService.setCurrentUserInfo (null, null, null);
    this.router.navigateByUrl('/login');
  }
}
