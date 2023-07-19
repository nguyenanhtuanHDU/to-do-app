import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  apiTask = environment.apiBackend + 'projects';

  constructor(
    private readonly http: HttpClient,
    private authService: AuthService
  ) {}

  createProject(project: Project) {
    return this.http.post(this.apiTask, project, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiTask, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }
}
