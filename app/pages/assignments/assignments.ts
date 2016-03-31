import {Page} from 'ionic-angular';
import {Patient, patients} from '../../patients';
import * as _ from 'lodash';

class Nurse {
  patients: Patient[];

  constructor(public name: string){
    this.patients = [];
  }
}

@Page({
  templateUrl: 'build/pages/assignments/assignments.html'
})
export class AssignmentsPage {
  adding: boolean;
  nurses: Nurse[];

  constructor() {
    this.nurses = JSON.parse(localStorage.getItem('nurses') || "[]");
    this.redistribute();
    patients.ee.subscribe(data => this.redistribute());
  }

  redistribute() {
    let {nurses} = this;
    if (!nurses[0]) return;
    nurses.forEach(n => n.patients = []);
    _.sortBy(patients.patients, 'score').reverse().forEach((p, i) => {
      let idx = i % nurses.length;
      nurses[idx].patients.push(p);
    });
  }

  add(name) {
    this.nurses.push(new Nurse(name));
    this.adding = false;
    localStorage.setItem('nurses', JSON.stringify(this.nurses));
    this.redistribute();
  }

  save(nurse, name) {
    nurse.name = name;
    nurse.editing = false;
    localStorage.setItem('nurses', JSON.stringify(this.nurses));
  }

  remove(i) {
    this.nurses.splice(i,1);
    this.redistribute();
    localStorage.setItem('nurses', JSON.stringify(this.nurses));
  }

}
