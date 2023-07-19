import { Component } from '@angular/core';
import { colors } from '../shared/colors/colors';
import { Project, ProjectCreate, ProjectEdit } from '../models/project.model';
import { ProjectService } from '../services/project.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  isShowAddProjectDialog: boolean = false;
  isEditProjectDialog: boolean = false;
  listColors: string[] = colors.listMainColors;
  projects: Project[] = [];
  projectID: string = '';
  projectTitle: string = '';
  projectColor: string = '';
  userIDSession: string = this.authService.getUserID('userID');
  destroy = new Subject();

  constructor(
    private readonly projectService: ProjectService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    this.projectService
      .getAllProjects()
      .pipe(takeUntil(this.destroy))
      .subscribe((projects: Project[]) => {
        this.destroy.next(true);
        this.destroy.complete();
        this.projects = projects;
      });
  }

  showAddProjectDialog() {
    this.isShowAddProjectDialog = true;
  }

  showEditProjectDialog(project: Project) {
    this.isEditProjectDialog = true;
    this.projectID = project._id;
    this.projectTitle = project.title;
    this.projectColor = project.color;
    this.isShowAddProjectDialog = true;
  }

  resetForm() {
    this.projectTitle = '';
    this.projectColor = colors.primary;
  }

  changeProjectColor(color: string) {
    this.projectColor = color;
  }

  validateAddProject(): boolean {
    if (!this.userIDSession || !this.projectTitle || !this.projectColor) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please type full fields',
      });
      return false;
    }
    return true;
  }

  createProject() {
    if (!this.validateAddProject()) {
      return;
    }
    this.projectService
      .createProject({
        userID: this.userIDSession,
        title: this.projectTitle,
        color: this.projectColor,
      })
      .pipe(takeUntil(this.destroy))
      .subscribe((data: any) => {
        this.getAllProjects();
        this.destroy.next(true);
        this.destroy.complete();
        this.isShowAddProjectDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: data.message,
        });
      });
  }

  editProject() {
    this.projectService
      .editProject(this.projectID, {
        title: this.projectTitle,
        color: this.projectColor,
      })
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (data: any) => {
          this.getAllProjects();
          this.destroy.next(true);
          this.destroy.complete();
          this.resetForm();
          this.isShowAddProjectDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message,
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        }
      );
  }

  deleteProject(projectID: string) {
    this.confirmationService.confirm({
      message: 'Do you want to to delete this project?',
      icon: 'pi pi-question',
      accept: () => {
        this.projectService
          .deleteProject(projectID)
          .pipe(takeUntil(this.destroy))
          .subscribe(
            (data: any) => {
              this.getAllProjects();
              this.destroy.next(true);
              this.destroy.complete();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: data.message,
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message,
              });
            }
          );
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }
}
