import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InformationDialogComponent } from 'src/app/core/components/information-dialog/information-dialog.component';
import { ApiService } from 'src/app/shared/services/api/api.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocalStorageStrings } from 'src/app/shared/local-storage-strings';
import { AppStrings } from 'src/app/shared/app-strings';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  protected loginForm!: FormGroup;
  protected showPassword: boolean = false;
  protected hasSubmittedOnce = false;

  constructor(
    private auth: ApiService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem(LocalStorageStrings.accessToken) !== null) {
      console.log('popping off');

      this.router.navigate([AppStrings.defaultPage]);
      return;
    }
    this.loginForm = this.formBuilder.group({
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  protected getFormControllers(name: string) {
    const ctrl = this.loginForm.get(name) as FormControl;
    if (!ctrl) throw 'Missing Form Control for ' + name;
    return ctrl;
  }

  protected togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  protected login() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) {
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      (response) => {
        //do something.
        this.router.navigate([AppStrings.defaultPage]);
      },
      (error) => {
        console.error('Login error', error);
      }
    );
  }

  protected loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  protected openErrorDialog(message: string) {
    this.dialog.open(InformationDialogComponent, {
      data: {
        message: message,
      },
    });
  }
}
