import { Injectable } from '@angular/core';
import { Project, ProjectCreate, ProjectEdit } from '../models/project.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  apiProject = environment.apiBackend + 'projects/';

  constructor(
    private readonly http: HttpClient,
    private authService: AuthService
  ) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiProject, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }

  createProject(project: ProjectCreate) {
    return this.http.post(this.apiProject, project, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }

  editProject(projectID: string, project: ProjectEdit) {
    console.log(`🚀 ~ project:`, project);

    return this.http.put(this.apiProject + 'project/' + projectID, project, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }

  deleteProject(projectID: string) {
    return this.http.delete(this.apiProject + 'project/' + projectID, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }
}
