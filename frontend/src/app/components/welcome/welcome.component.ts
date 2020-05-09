import { Component, OnInit } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { Professional } from '@interfaces/person'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  public professional: Professional;

  ngOnInit(): void {
    this.apiService.get('/welcome').subscribe(
      (reply) => {
        console.log('test');
        console.log(reply);
      },
      (error) => {
        console.log('tffest');
        console.log(error);
      }
    );
  }

}
