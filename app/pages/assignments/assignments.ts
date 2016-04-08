import {Page} from 'ionic-angular';
import * as _ from 'lodash';
import {Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';
import {CORE_DIRECTIVES} from 'angular2/common';
import {nurses, patients, meta, Nurse, Patient} from '../../data';

@Page({
  templateUrl: 'build/pages/assignments/assignments.html',
  directives: [Dragula, CORE_DIRECTIVES],
  viewProviders: [DragulaService]
})
export class AssignmentsPage {
  adding: boolean;
  nurses: Nurse[];
  auto: boolean;
  patients: Object;

  constructor(private dragulaService: DragulaService) {
    dragulaService.setOptions('bag-one', {
      moves: (el, container, handle) => ~handle.className.indexOf('ar-move-icon')
    });

    // TODO Look into dragulaService subscribe options
    dragulaService.dropModel.subscribe(() => nurses.calculateColors());
    dragulaService.removeModel.subscribe(() => nurses.calculateColors());

    this.nurses = nurses.items;
    this.patients = patients.items;
    this.auto = meta.auto;
  }

  add(name) {
    nurses.add(name);
    this.adding = false;
  }

  save = nurses.update
  remove = nurses.remove
  toggleAuto = meta.toggleAuto
}
