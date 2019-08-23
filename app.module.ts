import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CurrencyPipe} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ShareButtonsModule } from '@ngx-share/buttons';


import { AppComponent } from './app.component';
import { NewProjectComponent } from './new-project/new-project.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { LoginComponent } from './login/login.component';
import { ListProjectsComponent } from './edit-projects/list-projects.component';
import { EditProjectComponent } from './edit-projects/edit-project.component';
import { ProjectFormComponent } from './helpers/project-form.component';

import { PpService } from './services/pp.service';
import { UserService } from './services/user.service';
import { LangService } from './services/lang.service';
import { Utils } from './utils/utils';
import { routing } from './app.routes';

import { getCityNamePipe } from './models/city';
import { filterProjectsByPositionPipe } from './models/project';


import {
  AuthMethods,
  AuthProvider,
  AuthProviderWithCustomConfig,
  CredentialHelper,
  FirebaseUIAuthConfig,
  FirebaseUIModule
} from 'firebaseui-angular';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

import { environment } from '../environments/environment';
import { AuthGuard } from './auth.guard';
import { HeaderComponent } from './header/header.component';
import { HelpComponent } from './help/help.component';
import { LandingComponent } from './landing/landing.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';


const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    //facebookCustomConfig,
    //AuthProvider.Twitter,
    //AuthProvider.Github,
    AuthProvider.Password
    //AuthProvider.Phone
  ],
  method: AuthMethods.Popup,
  tos: '<your-tos-link>',
  credentialHelper: CredentialHelper.AccountChooser
};

@NgModule({
  declarations: [
    AppComponent,
    NewProjectComponent,
    AllProjectsComponent,
    LoginComponent,
    HeaderComponent,
    ListProjectsComponent,
    ProjectFormComponent,
    EditProjectComponent,
    getCityNamePipe,
    filterProjectsByPositionPipe,
    HelpComponent,
    LandingComponent,
    ProjectDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    HttpClientModule,       // required by ShareModule
    ShareButtonsModule.forRoot()
  ],
  exports: [
    getCityNamePipe, filterProjectsByPositionPipe
  ],
  providers: [PpService, Utils, AngularFireAuth, UserService, AuthGuard, LangService, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

//{ provide: LOCALE_ID, useValue: 'pt' } ],