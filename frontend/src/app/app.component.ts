import { Component } from '@angular/core';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private primeConfig: PrimeNGConfig,
    private readonly messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.primeConfig.ripple = true;
  }

  menuItems: MenuItem[] = [
    {
      icon: 'pi pi-pencil',
      command: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Add',
          detail: 'Data Added',
        });
      },
    },
    {
      icon: 'pi pi-refresh',
      command: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Update',
          detail: 'Data Updated',
        });
      },
    },
    {
      icon: 'pi pi-trash',
      command: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Delete',
          detail: 'Data Deleted',
        });
      },
    },
    {
      icon: 'pi pi-upload',
      routerLink: ['/fileupload'],
    },
    {
      icon: 'pi pi-external-link',
      target: '_blank',
      url: 'http://angular.io',
    },
  ];
}
