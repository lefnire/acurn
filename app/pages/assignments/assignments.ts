import {Page, ActionSheet, NavController} from 'ionic-angular';
import * as _ from 'lodash';
import {Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';
import {CORE_DIRECTIVES} from 'angular2/common';
import {nurses, patients, meta, Nurse, Patient} from '../../data';
import {PatientPage} from '../patient/patient';

@Page({
  templateUrl: 'build/pages/assignments/assignments.html',
  directives: [Dragula, CORE_DIRECTIVES],
  viewProviders: [DragulaService]
})
export class AssignmentsPage {
  adding: boolean;
  nurses: Object;
  patients: Object;
  meta: Object;
  nav: NavController;
  actionSheet: ActionSheet;

  constructor(
    dragulaService: DragulaService,
    nav: NavController
  ) {
    this.nav = nav;
    dragulaService.setOptions('bag-one', {
      moves: (el, container, handle) => ~handle.className.indexOf('ar-move-icon')
    });

    // TODO Look into dragulaService subscribe options
    dragulaService.dropModel.subscribe(() => nurses.calculateColors());
    dragulaService.removeModel.subscribe(() => nurses.calculateColors());

    this.nurses = nurses;
    this.patients = patients;
    this.meta = meta;
  }

  isEmpty = _.isEmpty
  toArray = _.toArray

  xorEmpty() {
    return _.isEmpty(patients.items) ^ !nurses.items[0];
  }

  clickAdd() {
    this.nav.present(ActionSheet.create({
      buttons: [{
        text: 'Patient',
        handler: () => {
          this.nav.push(PatientPage, {
            patient: new Patient()
          });
        }
      },{
        text: 'Nurse',
        handler: () => {this.adding = true;}
      },{
        text: 'Cancel',
        role: 'cancel',
      }]
    }));
  }

  editPatient(patient: Patient) {
    this.nav.push(PatientPage, {patient});
  }

  addNurse(name) {
    nurses.add(name);
    this.adding = false;
  }
}
