import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted: boolean = false;
  is_auth: boolean=false;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    if (localStorage.getItem(`${environment.appName}` + 'user')) {
      this.is_auth = true;
      this.router.navigate(['/dashboard']);
    } else {
      this.is_auth = false;
    }
  }

  get f() { return this.loginForm.controls; }

  submit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.auth.login(
      this.f['username'].value,
      this.f['password'].value
    ).subscribe(data => {
      if (data.status.code === 0) {
        this.router.navigate(['/dashboard']);
      } else {

      }
    })
  }

}
