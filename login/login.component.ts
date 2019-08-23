import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {FirebaseUISignInSuccess} from 'firebaseui-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
              '../landing/landing.component.css'
  ]
})
export class LoginComponent implements OnInit {

  myComponentId: string = 'Login';

  constructor(private afAuth: AngularFireAuth, private router: Router, 
              private route: ActivatedRoute, private userService: UserService) { 

  }

  ngOnInit(): void {
    const action = this.route.snapshot.paramMap.get('action');
    let toLoad = (action === "new") ? "/new" : "/edit";
    this.afAuth.authState.subscribe(d => {
      if (d) {
        this.userService.setLoggedInStatus (true);
        this.userService.setCurrentUserInfo (d.displayName, d.email, d.uid);
        this.router.navigateByUrl(toLoad);
      } else {
        this.userService.setLoggedInStatus (false);
      }

    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  successCallback(data: FirebaseUISignInSuccess) {
    console.log("successCallback(): " + data.currentUser.displayName);
    // TODO: isn't it redundant with the same call at subcription above? It may not be needed here.
    this.userService.setCurrentUserInfo (data.currentUser.displayName, data.currentUser.email,
                                          data.currentUser.uid);
  }
}
