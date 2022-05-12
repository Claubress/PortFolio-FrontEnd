import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PortfolioService } from 'src/app/services/portfolio.service';
import { AuthService } from 'src/app/services/auth.service';


import { Modal } from 'bootstrap'
import * as bootstrap from 'bootstrap';

import { Experience } from 'src/app/models/experience.model'
import { IPosition } from 'src/app/models/IPosition.model';
import { ICompany } from 'src/app/models/ICompany.model';
import { IMode } from 'src/app/models/IMode.model';
import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  private ownerId: number =  0;

  private resource: string = 'api/v1/experiences';

  private resourceExperienceByPerson: string = 'api/v1/experiences/search?filtro=';

  private resourcePosition: string = 'api/v1/positions';
  private resourceCompany: string = 'api/v1/companies';
  private resourceMode: string = 'api/v1/modes';

  public isUsrLoged: boolean = false;

  private changeLoginRef?: Subscription;

  public experienceList: Experience[] = [];

  public positionList: IPosition[] = [];
  public companyList: ICompany[] = [];
  public modeList: IMode[] = [];
  
  public formExperience: FormGroup = new FormGroup({});

  private myModal: Modal | undefined;

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private ownerService: OwnerService
  ) { }

  ngOnInit(): void {
  
    this.changeLoginRef = this.authService.changeLogin$.subscribe(() =>
      this.isUsrLoged = this.authService.getUserLoged());
  
    this.ownerService.disparadorHeader.subscribe(data => {
      this.ownerId = data;  
      this.loadData(this.ownerId);
    });

    this.loadPosition();

    this.loadCompany();

    this.loadMode();
    
    this.formExperience = new FormGroup({
      id: new FormControl(''),
      start: new FormControl('', [Validators.required]),
      end: new FormControl(''),
      timeElapsed: new FormControl(''),
      description: new FormControl('', [Validators.required]),
      company: new FormControl('', [Validators.required]),
      mode: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      logo: new FormControl('')
    });

    this.myModal = new bootstrap.Modal(document.getElementById('experienceModal') as HTMLElement, {keyboard: false});
  }
  
  private loadData(id: number): void {
    this.portfolioService.getData(this.resourceExperienceByPerson + id).subscribe(data => {
      this.mapApiModel(data);
      console.log(this.experienceList);
    });  
  }

  private loadPosition(): void { 
    this.portfolioService.getData(this.resourcePosition).subscribe(data => {
      this.positionList = data;
    });            
  }

  private loadCompany(): void { 
    this.portfolioService.getData(this.resourceCompany).subscribe(data => {
      this.companyList = data;
    });            
  }

  private loadMode(): void { 
    this.portfolioService.getData(this.resourceMode).subscribe(data => {
      this.modeList = data;
    });            
  }

  private mapApiModel(data: any): void {
    let newElement: any;
    this.experienceList = [];
    data.forEach((element: Experience) => {
      newElement = {
        id: element.id,
        start: element.start,
        end: element.end,
        time_elapsed: element.time_elapsed,
        description: element.description,
        company: element.company,
        mode: element.mode,
        position: element.position
      };
      this.experienceList.push(newElement);
    });
  }

  createItem(): void {
    this.formExperience.reset();
    this.myModal?.show();
  }

  updateItem(dataForm: any): void {
    this.formExperience.patchValue({
      id: dataForm.id,
      start: dataForm.start,
      end: dataForm.end,
      timeElapsed: dataForm.time_elapsed,
      description: dataForm.description,
      company: dataForm.company.id,
      mode: dataForm.mode.id,
      position: dataForm.position.id,
      logo: dataForm.company.logo
    });
    this.myModal?.show();
  }

  deleteItem(id: string): void {
    let url = this.resource + '/' +  id;
    this.portfolioService.deleteData(url).subscribe(() =>  this.loadData(this.ownerId));
  }

  saveChanges(): void {
    let url = this.resource + '/';
    const saveData = {
      id: this.formExperience.value.id,
      start: this.formExperience.value.start,
      end: this.formExperience.value.end,  
      time_elapsed: this.formExperience.value.timeElapsed,
      description: this.formExperience.value.description,
      company: {id: this.formExperience.value.company},
      mode: {id: this.formExperience.value.mode},
      position: {id: this.formExperience.value.position},
      person: {id: this.ownerId}
    }
    if(saveData.id) {
        url = url + saveData.id;
        this.portfolioService.upDateData(url, saveData).subscribe(() => this.loadData(this.ownerId));
    } else {
        this.portfolioService.createData(url, saveData).subscribe(() => this.loadData(this.ownerId));
    }

    this.myModal?.toggle();

  }  

  close(): void {
    this.myModal?.toggle();
  }

  onSelectCompany(id: number): void {
    this.companyList.forEach((element: ICompany) => {
      if (element.id === Number(id)) {
        this.formExperience.patchValue({
           logo: element.logo
        });          
      }         
    });
  }
}
