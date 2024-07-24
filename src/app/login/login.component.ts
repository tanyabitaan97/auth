import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
});

  loading = false;
  submitted = false;
  returnUrl: any;
  currentUser:any;

  constructor(private formBuilder: FormBuilder,   //DI
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService) { 
          if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
     }

  ngOnInit() {
 
  // get return url from route parameters or default to '/'
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  get f() { return this.loginForm.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
    .subscribe((x:any)=>{
      //window.alert('success');
      this.currentUser=x;
      this.loginButton();
    },(error:any)=>{
      window.alert(error);
});
        
  }

  loginButton() {
    this.router.navigate(['profile',this.currentUser.role,this.currentUser.id]);
  }

}
