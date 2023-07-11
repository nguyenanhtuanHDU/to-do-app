import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { TaskEdit, Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  apiTask = environment.apiBackend + 'tasks/';

  getTasksByUserID(userID: string): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiTask + userID, {
      headers: this.authService.getHeaders(),
    });
  }

  addATask(title: string, exprise: string, color: string, files: any[]) {
    const formData: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    const data = { title, exprise, color };
    formData.append('data', JSON.stringify(data));
    return this.http.post(this.apiTask, formData, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }

  editTask(
    newFiles: File[],
    fileDeleted: string[],
    taskData: TaskEdit,
    taskID: string
  ) {
    const formData: FormData = new FormData();
    for (let i = 0; i < newFiles.length; i++) {
      formData.append('file', newFiles[i]);
    }
    const data: any = taskData;
    data.fileDeleted = fileDeleted;
    formData.append('data', JSON.stringify(data));
    return this.http.put(this.apiTask + 'task/' + taskID, formData, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }

  doneTask(taskID: string) {
    return this.http.put(
      this.apiTask + taskID,
      { type: 'DONE_TASK' },
      {
        headers: this.authService.getHeaders(),
      }
    );
  }

  unDoneTask(taskID: string) {
    return this.http.put(
      this.apiTask + taskID,
      { type: 'UNDONE_TASK' },
      {
        headers: this.authService.getHeaders(),
      }
    );
  }

  deteleTaskByID(taskID: string) {
    console.log(`🚀 ~ taskID:`, taskID);

    return this.http.delete(this.apiTask + taskID, {
      headers: this.authService.getHeaders(),
      withCredentials: true,
    });
  }
}
