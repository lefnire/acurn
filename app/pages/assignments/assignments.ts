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
  }

  redistribute() {
    let {nurses} = this;
    nurses.forEach(n => n.patients = []);
    _.sortBy(patients, 'score').forEach((p, i) => {
      let idx = i % (nurses.length - 1);
        idx = isNaN(idx) ? 0 : idx;
      nurses[idx].patients.push(p);
    });
  }

  add(name) {
    this.nurses.push(new Nurse(name));
    this.adding = false;
    localStorage.setItem('nurses', JSON.stringify(this.nurses));
    this.redistribute();
  }

}
