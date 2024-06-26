import { of, throwError } from 'rxjs';
//Service for communicating between php and Angular
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { EMPTY, Observable, catchError, first, map, switchMap } from 'rxjs';
import { FeatureList } from 'src/features';
import { IGeneric } from 'src/app/shared/models/generic';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { AppUser } from 'src/app/shared/models/app-user';
import { IToken } from 'src/app/shared/models/token';
import { LocalStorageStrings } from '../../local-storage-strings';
import { AppStrings } from '../../app-strings';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl: string;
  protected accessToken: string = '';
  protected refreshToken: string = '';
  //Legacy Vars below here ---------
  protected legacyBaseUrl: string;
  private static processArray = Array<number>();
  private static deAuthorized = false;

  constructor(
    protected httpClient: HttpClient,
    protected fireAuth: AngularFireAuth,
    protected router: Router
  ) {
    this.baseUrl = ApiService.setBaseURL();
    this.accessToken =
      localStorage.getItem(LocalStorageStrings.accessToken) || '';
    this.refreshToken =
      localStorage.getItem(LocalStorageStrings.refreshToken) || '';
    //Legacy-------
    this.legacyBaseUrl = ApiService.setBaseURL() + 'app.api.php';
  }

  postRequest(endpoint: string, data?: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/${endpoint}`, data);
  }

  getRequest(endpoint: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${endpoint}`);
  }

  public static setBaseURL() {
    const windowHostName = window.location.hostname;
    if (
      windowHostName === 'qa.fsdatabridge.com' ||
      windowHostName === 'www1.fsdatabridge.com' ||
      windowHostName === 'dev.fsdatabridge.com'
    ) {
      return `https://${windowHostName}/api`;
    } else if (windowHostName.includes('hana.ondemand.com')) {
      return 'https://qa.fsdatabridge.com/api';
    } else if (windowHostName === 'localhost') {
      return 'http://localhost:8000/api';
    }
    return `http://${windowHostName}/api`;
  }

  //--------------EVERYTHING OLD FORM HERE!!!!!!------------------------------------------------------

  public postRequestLegacy<T>(
    featureName: string,
    method: string,
    params?: object | string[],
    endpoint?: string
  ): Observable<T> {
    const eToken = ApiService.processArray.length + 1;
    ApiService.setExecutionToken(eToken);

    return new Observable((observer) => {
      const checkTokenInterval = setInterval(() => {
        if (ApiService.processArray[0] === eToken) {
          clearInterval(checkTokenInterval);
          observer.next(); // Notify that the token is available
          observer.complete();
        } else {
          // console.log('Waiting for previous request to complete.');
        }
      }, 50);
    }).pipe(
      switchMap(() => {
        if (ApiService.deAuthorized && ApiService.processArray.length > 0) {
          ApiService.processArray.shift();
          if (ApiService.processArray.length === 0) {
            ApiService.deAuthorized = false;
          }
          return EMPTY;
        }
        const payload = {
          params: params ?? {},
          method,
          feature: featureName,
        };
        const token = localStorage.getItem('token') ?? '';
        const requestHeader = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Token': token,
        };
        const requestOptions = {
          headers: new HttpHeaders(requestHeader),
        };
        if (endpoint !== null && endpoint !== undefined) {
          return this.httpClient
            .post<T>(this.baseUrl + endpoint, params, requestOptions)
            .pipe(
              catchError((error) => {
                if (
                  error instanceof HttpErrorResponse &&
                  error.status === 401 &&
                  error.error.message === 'Access token expired.'
                ) {
                  return this.refreshTokenRequest().pipe(
                    catchError((refreshError) => {
                      this.logout();
                      throw refreshError;
                    }),
                    switchMap(() => {
                      ApiService.processArray.shift();
                      return this.postRequestLegacy<T>(
                        featureName,
                        method,
                        params
                      );
                    })
                  );
                } else if (
                  error instanceof HttpErrorResponse &&
                  error.status === 401 &&
                  error.error.message === 'Access revoked.'
                ) {
                  ApiService.deAuthorized = true;
                  this.logout();
                  if (ApiService.processArray.length !== 0) {
                    ApiService.processArray.shift();
                  }
                  return EMPTY;
                }
                ApiService.processArray.shift();
                throw error;
              }),
              map((data) => {
                ApiService.processArray.shift();
                return data;
              })
            );
        }
        return this.httpClient
          .post<T>(this.legacyBaseUrl, payload, requestOptions)
          .pipe(
            catchError((error) => {
              if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                error.error.message === 'Access token expired.'
              ) {
                return this.refreshTokenRequest().pipe(
                  catchError((refreshError) => {
                    this.logout();
                    throw refreshError;
                  }),
                  switchMap(() => {
                    ApiService.processArray.shift();
                    return this.postRequestLegacy<T>(
                      featureName,
                      method,
                      params
                    );
                  })
                );
              } else if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                error.error.message === 'Access revoked.'
              ) {
                ApiService.deAuthorized = true;
                this.logout();
                if (ApiService.processArray.length !== 0) {
                  ApiService.processArray.shift();
                }
                return EMPTY;
              }
              ApiService.processArray.shift();
              throw error;
            }),
            map((data) => {
              ApiService.processArray.shift();
              return data;
            })
          );
      })
    );
  }

  public getRequestLegacy<T>(
    featureName: string,
    method: string,
    params?: object | string[]
  ): Observable<T> {
    const eToken = ApiService.processArray.length + 1;
    ApiService.setExecutionToken(eToken);

    return new Observable((observer) => {
      const checkTokenInterval = setInterval(() => {
        if (ApiService.processArray[0] === eToken) {
          clearInterval(checkTokenInterval);
          observer.next(); // Notify that the token is available
          observer.complete();
        } else {
          // console.log('Waiting for previous request to complete.');
        }
      }, 50);
    }).pipe(
      switchMap(() => {
        if (ApiService.deAuthorized && ApiService.processArray.length > 0) {
          ApiService.processArray.shift();
          if (ApiService.processArray.length === 0) {
            ApiService.deAuthorized = false;
          }
          return EMPTY;
        }
        let payload = new HttpParams()
          .set('feature', featureName)
          .set('method', method);
        if (params !== undefined) {
          if (typeof params === 'object') {
            const parameters = params as {
              [key: string]: string | number | boolean;
            };
            const objKeys = Object.keys(parameters);
            if (objKeys.length > 0) {
              Object.keys(parameters).forEach((key) => {
                payload = payload.append(key, parameters[key]);
              });
            }
          }
        }

        const token = localStorage.getItem('token') ?? '';
        const requestHeader = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Token': token,
        };
        return this.httpClient
          .get<T>(this.legacyBaseUrl, {
            headers: new HttpHeaders(requestHeader),
            params: payload,
          })
          .pipe(
            catchError((error) => {
              if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                error.error.message === 'Access token expired.'
              ) {
                return this.refreshTokenRequest().pipe(
                  catchError((refreshError) => {
                    this.logout();
                    throw refreshError;
                  }),
                  switchMap(() => {
                    ApiService.processArray.shift();
                    return this.getRequestLegacy<T>(
                      featureName,
                      method,
                      params
                    );
                  })
                );
              } else if (
                error instanceof HttpErrorResponse &&
                error.status === 401 &&
                error.error.message === 'Access revoked.'
              ) {
                ApiService.deAuthorized = true;
                this.logout();
                if (ApiService.processArray.length !== 0) {
                  ApiService.processArray.shift();
                }
                return EMPTY;
              }
              ApiService.processArray.shift();
              throw error;
            }),
            map((data) => {
              ApiService.processArray.shift();
              return data;
            })
          );
      })
    );
  }

  public postFileUpload<T>(
    featureName: string,
    files: { [key: string]: File },
    method?: string,
    params?: IGeneric
  ): Observable<T> {
    const token = localStorage.getItem('token') ?? '';
    const requestHeader = {
      Accept: 'application/json',
      'X-Token': token,
    };
    const requestOptions = {
      headers: new HttpHeaders(requestHeader),
    };
    const formData = new FormData();
    formData.append('feature', featureName);
    Object.keys(files).forEach((file) => {
      formData.append(file, files[file], files[file].name);
    });
    if (params !== undefined) {
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key] as string);
      });
    }
    if (method !== undefined) {
      formData.append('method', method);
    }
    return this.httpClient
      .post<T>(this.legacyBaseUrl, formData, requestOptions)
      .pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === 401 &&
            error.error.message === 'Access token expired.'
          ) {
            return this.refreshTokenRequest().pipe(
              catchError((refreshError) => {
                this.logout();
                throw refreshError;
              }),
              switchMap(() => {
                ApiService.processArray.shift();
                return this.postFileUpload<T>(
                  featureName,
                  files,
                  method,
                  params
                );
              })
            );
          } else if (
            error instanceof HttpErrorResponse &&
            error.status === 401 &&
            error.error.message === 'Access revoked.'
          ) {
            ApiService.deAuthorized = true;
            this.logout();
            if (ApiService.processArray.length !== 0) {
              ApiService.processArray.shift();
            }
            return EMPTY;
          }
          ApiService.processArray.shift();
          throw error;
        }),
        map((data) => {
          ApiService.processArray.shift();
          return data;
        })
      );
  }

  public login(credentials: { email: string; password: string }) {
    // login based on usermast

    this.postRequestLegacy<
      GenericResponse<{
        status: string;
        token: { token: string; refreshToken: string } | undefined;
        message: string | undefined;
      }>
    >(FeatureList.auth, 'loginUser', credentials, 'login')
      .pipe(first())
      .subscribe({
        next: (result) => {
          const status = result.data.status;
          const token = result.data.token;
          const message = result.data.message;
          if (status == 'successful' && token !== undefined) {
            this.setToken(token.token, token.refreshToken);
            this.setApplication();
          } else {
            alert(message ?? 'error logging in please try again');
          }
        },
        error: (error) => {
          console.log(error);

          const errorMsg = error.error.data.message;
          alert(errorMsg ?? 'User name or password is incorrect');
        },
      });
  }

  public async loginWithGoogle() {
    var provider = new GoogleAuthProvider();
    try {
      const result = await this.fireAuth.signInWithPopup(provider);
      this.updateGoogleLogin(result.user?.email ?? '', '');
      console.log('You have been successfully logged in!');
    } catch (error) {
      console.log(error);
    }
  }

  private updateGoogleLogin(email: string, password: string) {
    this.postRequestLegacy<
      GenericResponse<{
        status: string;
        token: { token: string; refreshToken: string } | undefined;
        message: string | undefined;
      }>
    >(FeatureList.auth, 'loginUserGmail', [email, password])
      .pipe(first())
      .subscribe({
        next: (result) => {
          const status = result.data.status;
          const token = result.data.token;
          const message = result.data.message;
          if (status == 'successful' && token !== undefined) {
            this.setToken(token.token, token.refreshToken);
            this.setApplication();
          } else {
            alert(message ?? 'error logging in please try again');
          }
        },
        error: (error) => {
          alert('User name or password is incorrect');
          console.log(error);
        },
      });
  }

  public logout() {
    const token = localStorage.getItem('token') ?? '';
    const requestHeader = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Token': token,
    };
    const payload = new HttpParams()
      .set('feature', FeatureList.auth)
      .set('method', 'logoutUser');
    const requestOptions = {
      headers: new HttpHeaders(requestHeader),
      params: payload,
    };
    this.httpClient
      .get(this.legacyBaseUrl, requestOptions)
      .pipe(first())
      .subscribe({
        next: () => {
          this.clearUserData();
          this.router.navigate(['']);
        },
        error: (_) => {
          alert('Log out failed.');
        },
      });
  }

  public isUserLoggedIn(): boolean {
    const usertoken = this.getToken();
    if (usertoken !== null && usertoken !== '') {
      return true;
    } else {
      return false;
    }
  }

  public getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  private static setExecutionToken(eToken: number) {
    ApiService.processArray.push(eToken);
  }

  private refreshTokenRequest() {
    const payload = {
      params: {
        refreshToken: localStorage.getItem('refreshToken') ?? '',
      },
      method: 'refreshAccessTokens',
      feature: FeatureList.auth,
    };
    const requestHeader = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Token': localStorage.getItem('token') ?? '',
    };
    const requestOptions = {
      headers: new HttpHeaders(requestHeader),
    };
    return this.httpClient
      .post<GenericResponse<IToken>>(
        this.legacyBaseUrl,
        payload,
        requestOptions
      )
      .pipe(
        map((response) => {
          this.setToken(response.data.token, response.data.refreshToken);
        })
      );
  }

  private setApplication() {
    this.getRequestLegacy<GenericResponse<AppUser>>(FeatureList.auth, 'getUser')
      .pipe(first())
      .subscribe({
        next: (response) => {
          const userData = response.data;
          Object.keys(userData).forEach((userProp) => {
            localStorage.setItem(userProp, userData[userProp] ?? '');
          });
          this.router.navigate([AppStrings.defaultPage]);
        },
      });
  }

  private setToken(token: string, refreshToken: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearUserData(): void {
    localStorage.clear();
  }

  //depcrecated
  // public getHomePageRoute() {
  //   return '/app/' + localStorage.getItem('landing_menucode');
  // }
}
