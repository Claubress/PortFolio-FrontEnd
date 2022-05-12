import { Component, OnInit } from '@angular/core';

// clases para formularios reactivos
import { FormGroup, FormControl, Validators } from '@angular/forms';

// clases para reaccionar al cambio login
import { Subscription } from 'rxjs';

import { PortfolioService } from 'src/app/services/portfolio.service';
import { AuthService } from 'src/app/services/auth.service';

// clases para manejar el modal desde código
import { Modal } from 'bootstrap'
import * as bootstrap from 'bootstrap';

// Data models
import { Person } from 'src/app/models/person.model';

import { IPosition } from 'src/app/models/IPosition.model';
import { ICountry } from 'src/app/models/ICountry.model';
import { IState } from 'src/app/models/IState.model';
import { ICity } from 'src/app/models/ICity.model';

import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-acerda-de',
  templateUrl: './acerda-de.component.html',
  styleUrls: ['./acerda-de.component.css']
})
export class AcerdaDeComponent implements OnInit {
  
  //Ahora agregado para guardar id Person
  private ownerId: number =  0;
  //

  // para habilitar edicion
  public isUsrLoged: boolean = false;
  
  // reaccionar al login
  private changeLoginRef?: Subscription;
  
  private resource: string = 'api/v1/people';

  private resourcePosition: string = 'api/v1/positions';
  private resourceCountry: string = 'api/v1/countries';
  private resourceState: string = 'api/v1/states/search?filtro=';
  private resourceCity: string = 'api/v1/cities/search?filtro=';

  public person: Person = new Person();
  
  public positionList: IPosition[] = [];
  public countryList: ICountry[] = [];
  public stateList: IState[] = [];
  public cityList: ICity[] = [];

  public formPersonalData: FormGroup = new FormGroup({});
  
  private myModal: Modal | undefined;

  public ubication: string = '';

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private ownerService: OwnerService
  ) { }

  ngOnInit(): void {

    // reaccionar al login
    this.changeLoginRef = this.authService.changeLogin$.subscribe(() =>
      this.isUsrLoged = this.authService.getUserLoged());

    this.ownerService.disparadorHeader.subscribe(data => {
      this.loadData(data);
    });

    this.loadPosition();

    this.loadCountry();
    
    this.formPersonalData = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      actualPosition: new FormControl('', [Validators.required]),
      ubicationCountry: new FormControl('', [Validators.required]),
      ubicationState: new FormControl('', [Validators.required]),
      ubicationCity: new FormControl('', [Validators.required]),
      photo: new FormControl(''),
      about: new FormControl(''),
      facebook: new FormControl(''),
      twitter: new FormControl(''),
      instagram: new FormControl('')
    });

    this.myModal = new bootstrap.Modal(document.getElementById('aboutModal') as HTMLElement, {keyboard: false});
  }

  private loadData(id: number): void {
    this.portfolioService.getData(this.resource  + '/' + id).subscribe(data => {

      this.mapApiModel(data);
 
      this.loadState(this.person.city.state.country.id);

      this.loadCity(this.person.city.state.id);
    });
  }

  private loadPosition(): void{ 
    this.portfolioService.getData(this.resourcePosition).subscribe(data => {
      this.positionList = data;
    });            
  }

  private loadCountry(): void { 
    this.portfolioService.getData(this.resourceCountry).subscribe(data => {
      this.countryList = data;
    });            
  }

  private loadState(id: number) : void { 
    this.portfolioService.getData(this.resourceState  +  id).subscribe(data => {
      this.stateList  = data;
    });            
  }

  private loadCity(id: number) : void{ 
    this.portfolioService.getData(this.resourceCity +  id).subscribe(data => {
      this.cityList = data;
    });            
  }

  private mapApiModel(data: any) {
    this.person.id = data.id;
    this.person.name = data.name;
    this.person.photo = data.photo;
    this.person.about = data.about;
    this.person.facebook = data.facebook;
    this.person.twitter = data.twitter;
    this.person.instagram = data.instagram;
    this.person.position = data.position;
    this.person.city = data.city; 
  }

  upDate(): void {
    
    this.formPersonalData.patchValue({
      id: this.person.id,
      name: this.person.name,
      actualPosition: this.person.position.id,
      ubicationCountry: this.person.city.state.country.id,
      ubicationState: this.person.city.state.id,
      ubicationCity: this.person.city.id,
      photo: this.person.photo,
      about: this.person.about,
      facebook: this.person.facebook,
      twitter: this.person.twitter,
      instagram: this.person.instagram
    });

    this.myModal?.show();
  }

  onSelectCountry(id: number): void {
    this.loadState(id);
  }

  onSelectState(id: number): void {
    this.loadCity(id);
  }

  saveChange(): void {

    const saveData = {
      id: this.formPersonalData.value.id,
      name: this.formPersonalData.value.name,
      about: this.formPersonalData.value.about,  
      photo: this.formPersonalData.value.photo,
      facebook: this.formPersonalData.value.facebook,
      twitter:this.formPersonalData.value.twitter,
      instagram:this.formPersonalData.value.instagram,
      position: {id: this.formPersonalData.value.actualPosition},
      city:  {id: this.formPersonalData.value.ubicationCity}
    }

    this.portfolioService.upDateData(this.resource + '/' + saveData.id, saveData).subscribe(data => {
      this.mapApiModel(data);
    });
    
    this.myModal?.toggle();
  }

  close(): void {
    this.myModal?.toggle();
  }
}
