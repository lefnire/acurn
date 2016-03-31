import {Page} from 'ionic-angular';
import {PatientsPage} from './patients/patients';
import {AssignmentsPage} from './assignments/assignments';

@Page({
  //templateUrl: 'build/pages/tabs/tabs.html'
  template: `
<ion-tabs>
  <!-- clipboard, medkit, pulse -->
  <!--<ion-tab [root]="tab1Root" tabTitle="Acuity" tabIcon="pulse"></ion-tab> -->
  <ion-tab [root]="tab1Root" tabTitle="Patients" tabIcon="people"></ion-tab>
  <ion-tab [root]="tab2Root" tabTitle="Assignments" tabIcon="filing"></ion-tab>
</ion-tabs>
`
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = PatientsPage;
  tab2Root: any = AssignmentsPage;
}
