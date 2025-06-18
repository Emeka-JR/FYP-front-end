import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      username: [''],
      role: ['student'],
      adminCode: ['']
    });

    this.updateValidators();

    // Update adminCode validator dynamically when role changes
    this.authForm.get('role')?.valueChanges.subscribe(() => {
      this.updateValidators();
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.authForm.reset({
      email: '',
      password: '',
      username: '',
      role: 'student',
      adminCode: ''
    });
    this.updateValidators();
  }

  private updateValidators() {
    const usernameControl = this.authForm.get('username');
    const roleControl = this.authForm.get('role');
    const adminCodeControl = this.authForm.get('adminCode');

    if (this.isLoginMode) {
      usernameControl?.clearValidators();
      roleControl?.clearValidators();
      adminCodeControl?.clearValidators();
    } else {
      usernameControl?.setValidators([Validators.required]);
      roleControl?.setValidators([Validators.required]);

      if (roleControl?.value === 'admin') {
        adminCodeControl?.setValidators([Validators.required]);
      } else {
        adminCodeControl?.clearValidators();
      }
    }

    usernameControl?.updateValueAndValidity();
    roleControl?.updateValueAndValidity();
    adminCodeControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;

    const { email, password, username, role } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(email, password).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => {
          this.error = err.error?.detail || 'An error occurred during login';
          this.isLoading = false;
        }
      });
    } else {
      this.authService.register(email, password, username, role).subscribe({
        next: () => this.router.navigate(['/home']),
        error: (err) => {
          this.error = err.error?.detail || 'An error occurred during registration';
          this.isLoading = false;
        }
      });
    }
  }
}
