import {Page} from 'ionic-angular';
import {Patient, patients} from '../../patients';
import * as _ from 'lodash';
import {Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';

class Nurse {
  patients: Patient[];

  constructor(public name: string){
    this.patients = [];
  }
}

@Page({
  templateUrl: 'build/pages/assignments/assignments.html',
  directives: [Dragula],
  viewProviders: [DragulaService],
})
export class AssignmentsPage {
  adding: boolean;
  nurses: Nurse[];

  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('bag-one', {
      moves: (el, container, handle) => ~handle.className.indexOf('ar-move-icon')
    });
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
