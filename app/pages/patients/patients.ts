import {Page, NavController} from 'ionic-angular';
import {PatientPage} from '../patient/patient';
import {Patient, patients} from '../../patients';

@Page({
  templateUrl: 'build/pages/patients/patients.html',
})
export class PatientsPage {
  patients: Patient[];
  nav: NavController;

  constructor(nav: NavController) {
    this.patients = patients.patients;
    this.nav = nav;
  }

  add() {
    this.nav.push(PatientPage, {
      patient: new Patient()
    });
  }

  edit(patient: Patient) {
    this.nav.push(PatientPage, {patient});
  }

  remove(i) {
    patients.remove(i);
  }
}
