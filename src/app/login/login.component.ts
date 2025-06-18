import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

  private setEmailValidators() {
    const emailControl = this.authForm.get('email');
    if (!emailControl) return;
    if (this.isLoginMode) {
      emailControl.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl.setValidators([Validators.required, Validators.email, this.emailDomainValidator.bind(this)]);
    }
    emailControl.updateValueAndValidity();
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
    this.setEmailValidators();
  }

  private updateValidators() {
    const usernameControl = this.authForm.get('username');
    const roleControl = this.authForm.get('role');
    const adminCodeControl = this.authForm.get('adminCode');
    this.setEmailValidators();

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

  emailDomainValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.authForm) return null; // Form not initialized yet
    const email = control.value;
    const role = this.authForm.get('role')?.value;
    if (!email || !role) return null;
    if (role === 'student' && !email.endsWith('@stu.cu.edu.ng')) {
      return { domain: 'Student emails must end with @stu.cu.edu.ng' };
    }
    if (role === 'admin' && !email.endsWith('@cu.edu.ng')) {
      return { domain: 'Admin emails must end with @cu.edu.ng' };
    }
    return null;
  }
}
