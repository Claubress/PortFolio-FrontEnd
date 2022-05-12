import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PortfolioService } from 'src/app/services/portfolio.service';
import { AuthService } from 'src/app/services/auth.service';
import { OwnerService } from 'src/app/services/owner.service';

import { Modal } from 'bootstrap'
import * as bootstrap from 'bootstrap';

import {Education} from 'src/app/models/education.model'
import { ISchool } from 'src/app/models/ISchool.model';
import { ITitle } from 'src/app/models/ITitle.model';


@Component({ 
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {
  
  // Traer ls id Person desde el header
  private ownerId: number =  0;
  
  private resource: string = 'api/v1/educations';

  private resourceEducationByPerson: string = 'api/v1/educations/search?filtro=';

  private resourceSchool: string = 'api/v1/schools';
  private resourceTitle: string = 'api/v1/titles';
  
  public isUsrLoged: boolean = false;

  private changeLoginRef?: Subscription;
  
  public educationList: Education[] = [];
  
  public schoolList: ISchool[] = [];
  public titleList: ITitle[] = [];
  
  public formEducation: FormGroup = new FormGroup({});

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

    this.loadSchool()

    this.loadTitle()

    this.formEducation = new FormGroup({
      id: new FormControl(''),
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required]),
      school: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      logo: new FormControl('')
    });

    this.myModal = new bootstrap.Modal(document.getElementById('educationModal') as HTMLElement, {keyboard: false});

  }

  private loadData(id: number): void {
    this.portfolioService.getData(this.resourceEducationByPerson + id).subscribe(data => {
      this.mapApiModel(data)
    });
  }
 
  private loadSchool(): void{ 
    this.portfolioService.getData(this.resourceSchool).subscribe(data => {
      this.schoolList = data;
    });            
  }
  
  private loadTitle() : void{ 
    this.portfolioService.getData(this.resourceTitle).subscribe(data => {
      this.titleList  = data;
    });            
  }

  private mapApiModel(data: any): void {
    let newElement: any;
    this.educationList = [];
    data.forEach((element: Education) => {
      newElement = {
        id: element.id,
        start: element.start,
        end: element.end,
        school: element.school,
        title: element.title
      };
      this.educationList.push(newElement);
    });
  }

  createItem(): void {
    this.formEducation.reset();
    this.myModal?.show();
  }

  upDateItem(dataForm: any): void {
    this.formEducation.patchValue({
      id: dataForm.id,
      start: dataForm.start,
      end: dataForm.end,
      school: dataForm.school.id,
      title: dataForm.title.id,
      logo: dataForm.school.logo
    });
    this.myModal?.show();
  }


  deleteItem(id: string): void {
    let url = this.resource + '/' +  id;
    this.portfolioService.deleteData(url).subscribe(()  =>  this.loadData(this.ownerId));
  }

  saveChanges(): void {
    let url = this.resource + '/';
    const saveData = {
      id: this.formEducation.value.id,
      start: this.formEducation.value.start,
      end: this.formEducation.value.end,  
      school: {id: this.formEducation.value.school},
      title: {id: this.formEducation.value.title},
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

  onSelectSchool(id: number): void {
    this.schoolList.forEach((element: ISchool) => {
      if (element.id === Number(id)) {
        this.formEducation.patchValue({
           logo: element.logo
        });          
      }         
    });
  }

}
