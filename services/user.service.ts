import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  _userLoggedIn: boolean;
  _userName: string;
  _userEmail: string;
  _userId: string;

  constructor() { 
    this._userLoggedIn = false;
  }

  setLoggedInStatus (loggedIn: boolean) {
    this._userLoggedIn = loggedIn;
  }

  userIsLoggedIn () {;
    return this._userLoggedIn;
  }

  setCurrentUserInfo (userName: string, userEmail: string, userId: string) {
    this._userName = userName;
    this._userEmail = userEmail;
    this._userId = userId;
  }

  // TODO: Merge all three methods below into a single on and return an object with all user's info
  getCurrentUserName (){
    return this._userName;
  }

  getCurrentUserEmail (){
    return this._userEmail;
  }

  getCurrentUserId (){
    return this._userId;
  }
  
}
