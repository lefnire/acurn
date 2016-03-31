import {Page} from 'ionic-angular';
import {PatientsComponent} from '../patients/patients';
import {AssignmentsComponent} from '../assignments/assignments';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = PatientsComponent;
  tab2Root: any = AssignmentsComponent;
}
