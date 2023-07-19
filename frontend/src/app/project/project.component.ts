import { Component } from '@angular/core';
import { colors } from '../shared/colors/colors';
import { Project } from '../models/project.model';
import { ProjectService } from '../services/project.service';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  isShowAddProjectDialog: boolean = false;
  listColors: string[] = colors.listMainColors;
  projects: Project[] = [];
  userIdSession: string = '';
  projectCreate: Project = {
    userID: this.userIdSession,
    title: '',
    color: colors.primary,
  };
  destroy = new Subject();

  constructor(
    private readonly projectService: ProjectService,
    private readonly authService: AuthService,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.userIdSession = this.authService.getUserID('userID');
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

  changeProjectColor(color: string) {
    this.projectCreate.color = color;
  }

  validateAddProject(): boolean {
    if (
      !this.projectCreate.userID ||
      !this.projectCreate.title ||
      !this.projectCreate.title
    ) {
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
      .createProject(this.projectCreate)
      .pipe(takeUntil(this.destroy))
      .subscribe((data: any) => {
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
}
