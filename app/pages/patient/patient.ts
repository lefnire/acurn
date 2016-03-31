import {Page, NavController, NavParams} from 'ionic-angular';
import * as _ from 'lodash';

@Page({
  templateUrl: 'build/pages/patient/patient.html',
})
export class PatientComponent {
  calculation: number;
  nav: NavController;
  //navParams: NavParams;
  patient: any;

  constructor(nav: NavController, navParams: NavParams){
    this.nav = nav;
    this.patient = navParams.get('patient');
  }

  add() {
    // TODO Chain outer with _.zip, so we only need one _.reduce level
    this.patient.score = _(this.patient.form).map('items').reduce((sum, section) => {
      return sum + _.reduce(section, (sum, questions, level) => {
        return sum + _(questions).map(q => q.value || 0).sum() * (level + 1);
      }, 0);
    }, 0);
    this.nav.pop();
  }
}
