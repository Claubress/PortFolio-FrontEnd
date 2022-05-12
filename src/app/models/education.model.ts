import { ISchool } from "./ISchool.model";
import { ITitle } from "./ITitle.model";

export class Education {

    public id: string;
    public start: string;
    public end: string;
     

    public school: ISchool;
    public title: ITitle;

    constructor() {
        this.id = '';
        this.start = '';
        this.end = '';
        

        this.school = {
            id: 0,
            name: '',
            logo: ''
        };
        
        this.title =  {
            id: 0,
            name:''
        }

    }
}
