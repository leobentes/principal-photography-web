import { RouterModule, Routes } from '@angular/router';
import { NewProjectComponent } from './new-project/new-project.component';
import { ListProjectsComponent } from './edit-projects/list-projects.component';
import { EditProjectComponent } from './edit-projects/edit-project.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { HelpComponent } from './help/help.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { ProjectDetailsComponent  } from './project-details/project-details.component';
import { UserService } from './services/user.service';
import { AuthGuard } from './auth.guard';


const appRoutes: Routes  = [
    { path: '', redirectTo: '/landing', pathMatch: 'full' },
    { path: 'landing', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'login/:action', component: LoginComponent },
    { path: 'new', component: NewProjectComponent, canActivate: [AuthGuard] },
    { path: 'edit', component: ListProjectsComponent, canActivate: [AuthGuard] },
    { path: 'all', component: AllProjectsComponent },
    { path: 'filming/:cityCode/:id', component: ProjectDetailsComponent },
    { path: 'help', component: HelpComponent },
    { path: '**', redirectTo: ''}
  ];

  //export const routing = RouterModule.forRoot(appRoutes, { enableTracing: true });
  export const routing = RouterModule.forRoot(appRoutes);
