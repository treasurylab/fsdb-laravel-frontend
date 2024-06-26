import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LocalStorageStrings } from 'src/app/shared/local-storage-strings';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { AppStrings } from 'src/app/shared/app-strings';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * This service deals with authentication
   * 1. Login
   * 2. Logout
   * 3. Refreshing Token
   *
   * This service can also provide information on the user
   * 1. @isAuthenticated returns a boolean
   * 2. @getAccessToken returns the access token if set.
   */
  private apiUrl: string;
  private accessTokenSubject: BehaviorSubject<string | null>;
  public accessToken: Observable<string | null>;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router
  ) {
    this.apiUrl = ApiService.setBaseURL();
    this.accessTokenSubject = new BehaviorSubject<string | null>(
      localStorage.getItem(LocalStorageStrings.accessToken)
    );
    this.accessToken = this.accessTokenSubject.asObservable();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    /**
     * 1. Sends a request to backend with email and password.
     * 2. Sets the access/refresh tokens.
     * 3. Sets the user data.
     * 4. Navigates to Dashboard.
     */
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        var tokenData = response['data']['token'];
        this.storeTokens(tokenData['access_token'], tokenData['refresh_token']);
        this.setUsers(response['data']);
        this.router.navigate([AppStrings.defaultPage]);
      })
    );
  }

  logout() {
    /**
     * 1. Sends a request to laravel to deauthenticate,
     * 2. Removes tokens from localStorage
     * 3. Navigates to Home Page.
     */
    this.apiService.postRequest('logout');
    localStorage.removeItem(LocalStorageStrings.accessToken);
    localStorage.removeItem(LocalStorageStrings.refreshToken);
    this.accessTokenSubject.next(null);
    this.router.navigate(['']);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem(LocalStorageStrings.refreshToken);
    return this.http
      .post<any>(`${this.apiUrl}/refresh-token`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.storeTokens(response.access_token, response.refresh_token);
        })
      );
  }

  private storeTokens(accessToken: string, refreshToken: string) {
    //Stores the Access and Refresh Token into localStorage
    localStorage.setItem(LocalStorageStrings.accessToken, accessToken);
    localStorage.setItem(LocalStorageStrings.refreshToken, refreshToken);
    this.accessTokenSubject.next(accessToken);
  }

  private setUsers(userData: any) {
    //Sets the User Details into localStorage
    localStorage.setItem(LocalStorageStrings.firstName, userData['first_name']);
    localStorage.setItem(LocalStorageStrings.lastName, userData['last_name']);
    localStorage.setItem(LocalStorageStrings.title, userData['title']);
    localStorage.setItem(LocalStorageStrings.userCode, userData['code']);
    localStorage.setItem(
      LocalStorageStrings.userCompany,
      userData['company_group']['name']
    );
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
