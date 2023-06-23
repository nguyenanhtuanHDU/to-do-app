import { Component } from '@angular/core';
import {
  faHome,
  faChartSimple,
  faFolderOpen,
  faCalendarDays,
  faGear,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { menuItem } from '../models/menuItem.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  menuItemsTop: menuItem[] = [
    {
      label: 'Overview',
      icon: faHome,
      routerLink: '',
    },
    {
      label: 'Stats',
      icon: faChartSimple,
      routerLink: 'stat',
    },
    {
      label: 'Projects',
      icon: faFolderOpen,
      routerLink: 'project',
    },
    {
      label: 'Calendar',
      icon: faCalendarDays,
      routerLink: 'calendar',
    },
  ];

  menuItemsBottom: menuItem[] = [
    {
      label: 'Settings',
      icon: faGear,
    },
    {
      label: 'Log out',
      icon: faArrowRightFromBracket,
    },
  ];

  ngOnInit() {}
}
