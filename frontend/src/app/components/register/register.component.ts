import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { UserBase } from '@models/user.model'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registrationForm = new FormGroup({
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  public createUser(): void {
    let user: UserBase = {
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password,
      firstname: this.registrationForm.value.firstname,
      lastname: this.registrationForm.value.lastname,
    }

    this.apiService.post('user', user).subscribe(
      (registrationReponse) => console.log(registrationReponse.items),
      (error) => console.log(error),
      // () => console.log('Business Units:', this.businessUnits)
    );
    console.log(user);
  }
}
