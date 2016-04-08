import * as _ from 'lodash';

const ls = {
  get(key, _default) {
    let item = localStorage.getItem(key);
    return item ? JSON.parse(item) : _default;
  },
  set(key, obj) {
    // don't block
    setTimeout(() => localStorage.setItem(key, JSON.stringify(obj)));
  }
};

export class Patient {
  form: Object[];
  room: string;
  isNew: boolean;
  score: number;
  id: number;

  constructor() {
    this.id = +new Date;
    this.isNew = true;
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

export class Nurse {
  patients: number[]; // ids
  id: number;
  score: number; // color

  constructor(public name: string){
    this.id = +new Date;
    this.patients = [];
  }
}

// ------------------

export let meta;
export let patients;
export let nurses;

meta = {
  auto: ls.get('auto', true),

  toggleAuto() {
    this.auto = !this.auto;
    ls.set('auto', this.auto);

    if (this.auto)
      return nurses.redistribute();
    // else what?
  }
};

patients = {
  items: ls.get('patients', {}),

  add(patient) {
    this.items[patient.id] = patient;
    //nurses.addPatient(patient);
    nurses.redistribute();
    this.save();
  },
  remove(id){
    delete this.items[id];
    nurses.redistribute();
    this.save();

  },
  save(){
    ls.set('patients', this.items);
  }
};

nurses =  {
  items: ls.get('nurses', []),

  add(name) {
    this.items.push(new Nurse(name));
    this.redistribute();
  },
  update(nurse, name) {
    nurse.name = name;
    nurse.editing = false;
    this.save();
  },
  remove(id) {
    _.remove(this.items, {id});
    this.redistribute();
  },
  calculateColors() {
    this.items.forEach(n => {
      n.score = _.sum(n.patients.map(p => patients.items[p].score));
    });
    this.save();
  },
  redistribute() {
    let nurses = this.items;
    if (!(meta.auto && nurses[0])) return;
    nurses.forEach(n => n.patients = []);

    // Sort patients by a combo of acuity & room-to-room-distance. b-a = DESC
    let sorted = _.toArray(patients.items).sort((a, b) =>
      b.score - a.score + Math.abs(+b.room - +a.room)
    );
    _.chunk(sorted, nurses.length).forEach(chunk => {
      nurses.reverse();
      chunk.forEach((p,i) => nurses[i].patients.push(p.id));
    });
    this.calculateColors();
    // this.save();
  },
  save(){
    ls.set('nurses', this.items);
  }
};
