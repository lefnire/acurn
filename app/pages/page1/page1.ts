import {Page} from 'ionic-angular';
import * as _ from 'lodash';

class Patient {
  form: Object[];
  constructor() {
    this.form = [{
      label: 'Complicated procedures',
      items: [[
        {label: 'Pulse ox'},
        {label: 'Foley'},
        {label: 'Oral care'},
        {label: 'Telemetry'},
      ], [
        {label: '> 4 L O2 nasal cannula'},
        {label: 'BIPAP/CPAP @ naps/night'},
        {label: 'Routine trach care ≤ 2 times/shift'},
        {label: 'PICC/central line'},
        {label: 'NG tube'},
        {label: 'Incontinent'},
        {label: 'PCA'},
        {label: 'Rectal tube'},
        {label: 'Isolation'},
        {label: 'Fall risk'},
      ], [
        {label: 'High-flow O2/vent'},
        {label: 'Continuous BIPAP'},
        {label: 'New trach or frequent suctioning'},
        {label: 'Trach care ≥ 3 times/shift'},
        {label: 'Wound/skin care'},
        {label: 'Ostomy'},
        {label: 'Assist w/ ADLs'},
        {label: 'Vitals or neurochecks q 2 h'},
        {label: 'Continuous bladder irrigation'},
        {label: 'Chest tube'},
        {label: 'Peritoneal dialysis'},
        {label: 'Opioid/alcohol withdrawal assessment'},
        {label: 'Unfinished admit'},
      ], [
        {label: 'Total care'},
        {label: 'Restraints'},
        {label: 'Total feed'},
        {label: 'Confused, restless combative'},
        {label: 'High fall risk/SOMA bed'},
        {label: 'Post code/rapid response team'},
      ]]
    }, {
      label: 'Education',
      items: [[
        {label: 'Standard (i.e., DM, HF)', value: true},
      ], [
        {label: 'New meds, side effects'},
      ], [
        {label: 'Discharge today'},
        {label: 'Family education'},
        {label: 'Pre-/postprocedure'},
      ], [
        {label: 'New diagnosis'},
        {label: 'Inability to comprehend'},
        {label: 'Multiple comorbidities'},
      ]]
    }, {
      label: 'Psychosocial or therapeutic interventions',
      items: [[
        {label: '≤ 2 interventions per shift'},
      ], [
        {label: '3-5 interventions per shift'},
      ], [
        {label: '6-10 interventions per shift'},
        {label: 'Diagnosis of delirium'},
        {label: 'End of life'},
      ], [
        {label: '> 10 interventions per shift'},
      ]]
    }, {
      label: 'Medications (oral)',
      items: [[
        {label: '1-5'},
      ], [
        {label: '6-10'},
      ], [
        {label: '11-15'},
      ], [
        {label: '≥ 16'},
      ]]
    }, {
      label: 'Complicated IV drugs & other meds',
      items: [[
        {label: 'Glucometer with coverage'},
      ], [
        {label: '2-5 IV meds'},
      ], [
        {label: 'K+ protocol'},
        {label: 'Heparin protocol'},
        {label: '> 5 IV meds'},
        {label: 'TPN'},
      ], [
        {label: 'Blood/blood products'},
        {label: 'Tube feeding/meds'},
        {label: 'Cardiac drip (amiodarone Cardizem, dopamine)'},
        {label: 'Insulin drip'},
      ]]
    }];
  }
}

@Page({
  templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
  patient: Patient;
  calculation: number;

  constructor() {
    this.patient =  new Patient();
    this.calculation = 0;
  }

  calculate() {
    // TODO Chain outer with _.zip, so we only need one _.reduce level
    this.calculation = _(this.patient.form).map('items').reduce((sum, section) => {
      return sum + _.reduce(section, (sum, questions, level) => {
        return sum + _(questions).map(q => q.value || 0).sum() * (level + 1);
      }, 0);
    }, 0);
  }
}
