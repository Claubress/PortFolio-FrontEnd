import { Component, OnInit } from '@angular/core';

// Para construir formulario reactivo
import { FormGroup, FormControl, Validators } from '@angular/forms';

// Servicio para  manejo de datos
import { PortfolioService } from 'src/app/services/portfolio.service';

// Servicio para  autenticación de usuario
import { AuthService } from 'src/app/services/auth.service';

/* para que funcionen las referencias a bootstrap hacer ...
   npm i --save-dev @types/bootstrap
   en la consola
*/
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';

// reaccionar a cambios en Acerca_de
import { Subscription } from 'rxjs';

// Modelo de datos
import { Person } from 'src/app/models/person.model';

import { OwnerService } from 'src/app/services/owner.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  //  Antes
  /*
  private resource: string = 'personalData';
  */
  // Ahora
  private resource: string = 'api/v1/people';


  public formLogin: FormGroup = new FormGroup({});

  public person: Person =  new Person();

  // reaccionar a cambios en Acerca_de
  subscription?: Subscription;

  private myModal: Modal | undefined;

  public textoBoton: string = "Login";  
  public firstName: string = "";
  public socialNetworks: any;
  public errorLogin: boolean = false;

  constructor(
    private portfolioService: PortfolioService,
    private authService: AuthService,
    private ownerService: OwnerService
    ) { }

  ngOnInit(): void {

    this.loadData();
   
    // reaccionar a cambios en Acerca_de
    this.subscription = this.portfolioService.refresh$.subscribe(() => {
      this.loadData();
    });
    
    // define campos formulario reactivo
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])});

    // Define objeto Modal para manejar ventana desde código
    this.myModal = new bootstrap.Modal(document.getElementById('loginModal') as HTMLElement, {keyboard: false});
  }

  private loadData(): void {
    this.portfolioService.getData(this.resource).subscribe(data => {
      this.person.id = data[0].id;
      this.person.name = data[0].name;
      this.firstName = this.person.firstName;
      this.socialNetworks = {
        "facebook": data[0].facebook, 
        "twitter": data[0].twitter, 
        "instagram": data[0].instagram 
      };
      this.ownerService.disparadorHeader.emit(this.person.id);
    });    
  }

  open(): void {
    if(this.authService.getAuth())  {      
      this.authService.removeAuth();
      this.textoBoton = "Login"
    } else {
      this.errorLogin = false;
      this.formLogin.reset();
      this.myModal?.show();
    }
  }

  login(): void {
    const userLogin = {
      userName: this.formLogin.value.email,
      password: this.formLogin.value.password
    }

    this.authService.login(userLogin).subscribe({
      next: (res) => {
        this.authService.setAuth(res.token);
        this.textoBoton = "Logout";
        this.myModal?.toggle();  
      },
      error: () => this.errorLogin = true   
    });

  }

  // AGREGADO para validadción campos formulario reactivo
  
  get Email() {
    return this.formLogin.get('email');
  }

  get Password() {
    return this.formLogin.get('password');
  }

}
