import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  usersList:any[]=[];
  currentUser:any;
  isUser:boolean=false;
  isAdmin:boolean=false;

  username:any;
  password:any;
  id:any;
  firstName:any;
  lastName:any;
  role:any;
  token:any;

  profileForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    id:['',Validators.required],
    firstName:['',Validators.required],
    lastName:['',Validators.required],
    role:['',Validators.required],
    token:['',Validators.required]
});
 
  constructor(private userService:UserService,
    private formBuilder: FormBuilder,private route: ActivatedRoute) { }

  ngOnInit(): void {

    let usersDump = [{'username':'abcd','password':1234,'id':1,'firstName':'abcd','lastName':'chaudhary','role':'user','token':'asdefrgtjjlll'},
      {'username':'defgh','password':12345,'id':2,'firstName':'abcd','lastName':'chaudhary','role':'admin','token':'asdefrgtjjlll'}]
  
    let id = this.route.snapshot.paramMap.get('id');
    let user = this.route.snapshot.paramMap.get('role');

    if(user=='user') {
      this.isUser=true;
    }

    if(user=='admin') {
      this.isAdmin=true;
    }

    type T0= NonNullable<string | number | undefined>;

    this.userService.getAll().subscribe((x:any)=>{
      let users = localStorage.getItem('users');
      this.usersList = JSON.parse(users as any);  
      this.usersList=usersDump;
      console.log('this.userslist '+JSON.stringify(this.usersList))
      this.usersList.forEach((x:any)=>{
        if(x.id==id){
          this.currentUser=x;
        }
      });
      console.log('current user '+JSON.stringify(this.currentUser));

      this.username=this.currentUser.username;
      this.password=this.currentUser.password;
      this.role=this.currentUser.role;
      this.firstName=this.currentUser.firstName;
      this.lastName=this.currentUser.lastName;
      this.id=this.currentUser.id;
      this.token=this.currentUser.token;

    });

    
  }

  get f() { return this.profileForm.controls; }

}
