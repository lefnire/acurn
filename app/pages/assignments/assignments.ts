import {Page} from 'ionic-angular';
import {Patient, patients} from '../../patients';
import * as _ from 'lodash';
import {Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';
import {CORE_DIRECTIVES} from 'angular2/common';

class Nurse {
  patients: Patient[];

  constructor(public name: string){
    this.patients = [];
  }
}

@Page({
  templateUrl: 'build/pages/assignments/assignments.html',
  directives: [Dragula, CORE_DIRECTIVES],
  viewProviders: [DragulaService],
})
export class AssignmentsPage {
  adding: boolean;
  nurses: Nurse[];
  auto: boolean;

  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('bag-one', {
      moves: (el, container, handle) => ~handle.className.indexOf('ar-move-icon')
    });
    this.nurses = JSON.parse(localStorage.getItem('nurses') || "[]");
    this.auto = JSON.parse(localStorage.getItem('auto') || "true");
    this.redistribute();
    patients.ee.subscribe(data => this.redistribute());
  }

  redistribute() {
    let {nurses, auto} = this;
    if (!(auto && nurses[0])) return;
    nurses.forEach(n => n.patients = []);

    // Sort patients by a combo of acuity & room-to-room-distance. b-a = DESC
    let sorted = patients.patients.sort((a, b) =>
      b.score - a.score + Math.abs(+b.room - +a.room)
    );
    _.chunk(sorted, nurses.length).forEach(chunk => {
      nurses.reverse();
      chunk.forEach((p,i) => nurses[i].patients.push(p));
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

  toggleAuto() {
    this.auto = !this.auto;
    localStorage.setItem('auto', JSON.stringify(this.auto));
    if (this.auto)
      return this.redistribute();
    // else what?
  }

}
