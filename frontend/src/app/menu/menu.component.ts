import { Component } from '@angular/core';
import {
  faHome,
  faFolderOpen,
  faCalendarDays,
  faGear,
  faArrowRightFromBracket,
  faListCheck
} from '@fortawesome/free-solid-svg-icons';
import { menuItem } from '../models/menuItem.model';
import { AuthService } from '../services/auth.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService
  ) {}

  menuItemsTop: menuItem[] = [
    {
      label: 'Overview',
      icon: faHome,
      routerLink: '',
    },
    {
      label: 'Tasks',
      icon: faListCheck,
      routerLink: 'tasks',
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
      click: () => this.handleLogOut(),
    },
  ];

  handleLogOut() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to log out?',
      accept: () => {
        this.authService.logOut().subscribe((data: any) => {
          this.router.navigate(['auth/login']);
        });
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Rejected',
              detail: 'You have rejected',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'You have cancelled',
            });
            break;
        }
      },
    });
  }
}
