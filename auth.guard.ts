import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor (private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.userService.userIsLoggedIn()) { return true; }

    // *** TODO: Store the attempted URL for redirecting. This is always redirecting to the edit page
    this.router.navigate(['/login']);
    return false;
  }

}
