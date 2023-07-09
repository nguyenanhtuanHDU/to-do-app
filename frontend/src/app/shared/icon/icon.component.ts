import { Component, Input } from '@angular/core';
import {
  IconDefinition,
  faAngleLeft,
  faAngleRight,
  faArrowRightFromBracket,
  faCalendarDays,
  faClock,
  faFile,
  faFolderOpen,
  faGear,
  faHome,
  faListCheck,
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

interface MyObject {
  [key: string]: IconDefinition;
}

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size?: number;

  listIcons: MyObject = {
    faPlus: faPlus,
    faClock: faClock,
    faFile: faFile,
    faPenToSquare: faPenToSquare,
    faTrash: faTrash,
    faAngleLeft: faAngleLeft,
    faAngleRight: faAngleRight,
    faHome: faHome,
    faListCheck: faListCheck,
    faFolderOpen: faFolderOpen,
    faCalendarDays: faCalendarDays,
    faGear: faGear,
    faArrowRightFromBracket: faArrowRightFromBracket,
  };
}
