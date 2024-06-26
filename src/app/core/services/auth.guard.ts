import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageStrings } from 'src/app/shared/local-storage-strings';

@Injectable({
  providedIn: 'root',
})
export class RedirectUnauthorizedToLogin {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (localStorage.getItem(LocalStorageStrings.accessToken) != null) {
      return true;
    }
    // navigate to login page as user is not authenticated
    this.router.navigate(['']);
    return false;
  }
}
