import { ICompany } from "./ICompany.model";
import { IMode } from "./IMode.model";
import { IPosition } from "./IPosition.model";
// import { Person } from "./person.model";

export class Experience {

    public id: string;
    public start: string;
    public end: string;
    public time_elapsed: string;
    public description: string;

    public position: IPosition;
    public company: ICompany;
    public mode: IMode;
    // public person : Person;

    constructor() {
        this.id = '';
        this.start = '';
        this.end = '';
        this.time_elapsed = '';
        this.description = '';

        this.position =  {
            id: 0,
            name: ''
        }
    
        this.company = {
            id: 0,
            name: '',
            logo: ''
        };
        
        this.mode =  {
            id: 0,
            name:''
        }

        // this.person = new Person();
    }

}