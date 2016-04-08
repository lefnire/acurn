import {Page, NavController} from 'ionic-angular';
import {PatientPage} from '../patient/patient';
import {Patient, patients} from '../../data';
import * as _ from 'lodash';

@Page({
  templateUrl: 'build/pages/patients/patients.html',
})
export class PatientsPage {
  patients: Object;
  nav: NavController;

  constructor(nav: NavController) {
    this.patients = patients.items;
    this.nav = nav;
  }

  isEmpty = _.isEmpty
  toArray = _.toArray

  add() {
    this.nav.push(PatientPage, {
      patient: new Patient()
    });
  }

  edit(patient: Patient) {
    this.nav.push(PatientPage, {patient});
  }

  remove = patients.remove
}
