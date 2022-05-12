import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// reaccionar al login
import { Subscription } from 'rxjs';
// *******************

import { PortfolioService } from 'src/app/services/portfolio.service';
import { AuthService } from 'src/app/services/auth.service';

import { Modal } from 'bootstrap'
import * as bootstrap from 'bootstrap';

import { Project } from 'src/app/models/project.model';
import { OwnerService } from 'src/app/services/owner.service';


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  private ownerId: number =  0;

  private resource: string = 'api/v1/projects';

  private resourceProjectByPerson: string = 'api/v1/projects/search?filtro=';

  public isUsrLoged: boolean = false;

  private changeLoginRef?: Subscription;

  public projectList: Project[] = [];
  public formProject: FormGroup = new FormGroup({});

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

    this.formProject = new FormGroup({
      id: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      image: new FormControl('')
    });

    this.myModal = new bootstrap.Modal(document.getElementById('projectModal') as HTMLElement, {keyboard: false});

  }

  private loadData(id: number): void {
    this.portfolioService.getData(this.resourceProjectByPerson + id).subscribe(data => {
      this.mapApiModel(data);
    })
  }

  private mapApiModel(data: any) {
    let newElement: any;
    this.projectList = [];
    data.forEach((element: Project) => {
      newElement = {
        id: element.id,
        title: element.title,
        description: element.description,
        image: element.image
      };
      this.projectList.push(newElement);
    });
  }
  
  createItem(): void {
    this.formProject.reset();
    this.myModal?.show();
  }

  updateItem(dataForm: any): void {
    this.formProject.patchValue({
      id: dataForm.id,
      title: dataForm.title,
      description: dataForm.description,
      image: dataForm.image
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
      id: this.formProject.value.id,
      title: this.formProject.value.title,
      description: this.formProject.value.description,  
      image: this.formProject.value.image,
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

}
