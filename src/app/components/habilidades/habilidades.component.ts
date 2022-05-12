import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PortfolioService } from 'src/app/services/portfolio.service';
import { AuthService } from 'src/app/services/auth.service';
import { OwnerService } from 'src/app/services/owner.service';

import { Modal } from 'bootstrap'
import * as bootstrap from 'bootstrap';

import { Skill } from 'src/app/models/skill.model';


@Component({
  selector: 'app-habilidades',
  templateUrl: './habilidades.component.html',
  styleUrls: ['./habilidades.component.css']
})
export class HabilidadesComponent implements OnInit {

  private ownerId: number =  0;

  private resource: string = 'api/v1/skills';

  private resourceSkillByPerson: string = 'api/v1/skills/search?filtro=';

  public isUsrLoged: boolean = false;

  private changeLoginRef?: Subscription;

  public skillList: Skill[] = [];
  public formSkill: FormGroup = new FormGroup({});

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
    
    this.formSkill = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      advanced: new FormControl('', [Validators.required])
    });

    this.myModal = new bootstrap.Modal(document.getElementById('skillModal') as HTMLElement, {keyboard: false});

  }

  private loadData(id: number): void {
    this.portfolioService.getData(this.resourceSkillByPerson + id).subscribe(data => {
      this.mapApiModel(data);
    })
  }

  private mapApiModel(data: any) {
    let newElement: any;
    this.skillList = [];
    data.forEach((element: Skill) => {
      newElement = {
        id: element.id,
        name: element.name,
        advanced: element.advanced
      };
      this.skillList.push(newElement);
    });
  }

  createItem(): void {
    this.formSkill.reset();
    this.formSkill.patchValue({"advanced": "0"});
    this.myModal?.show();
  }

  updateItem(dataForm: any): void {
    this.formSkill.patchValue({
      id: dataForm.id,
      name: dataForm.name,
      advanced: dataForm.advanced
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
      id: this.formSkill.value.id,
      name: this.formSkill.value.name,
      advanced: this.formSkill.value.advanced,  
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
