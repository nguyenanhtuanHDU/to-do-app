import { Component, ViewChild } from '@angular/core';
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faClock,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
// import {} from '@fortawesome/free-regular-svg-icons';
import { TaskService } from '../services/task.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Tasks } from '../models/tasks.model';
import { FileUpload } from 'primeng/fileupload';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent {
  @ViewChild('fileUpload', { static: false }) fileUpload: any;

  constructor(
    private readonly taskService: TaskService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getUserSerssion();
  }

  faPlus = faPlus;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faFile = faFile;
  faClock = faClock;

  apiBackendRoot = environment.apiBackendRoot;
  isShowAddTaskDialog: boolean = false;
  taskSelected!: Tasks;
  taskName: string = '';
  taskDate: string = '';
  userSession!: User;
  // tasks: Tasks[] = [];
  listTaskDone: Tasks[] = [];
  listTaskUnDone: Tasks[] = [];
  currentDate = new Date();
  headingDialog: string = '';
  filesSelected: any[] = [];
  oldFilesSelected: string[] = [];
  oldFilesDeleted: string[] = [];
  isAdd!: boolean;

  selectFileTasks(event: any) {
    console.log(`🚀 ~ event:`, event.currentFiles);
    this.filesSelected = event.currentFiles;
  }

  clearTaskFiles() {
    this.fileUpload.clear();
    this.filesSelected = [];
  }

  chooseOldFileDeleted(file: string) {
    if (!this.oldFilesDeleted.includes(file)) {
      this.oldFilesDeleted.push(file);
    }
  }

  deleteImgSelected(index: number) {
    console.log(`🚀 ~ index:`, index);
    this.filesSelected.splice(index, 1);
  }

  showAddTaskDialog(type: string, task: Tasks | null) {
    if (type === 'add') {
      this.isAdd = true;
      this.headingDialog = 'Add a task';
    } else if (type === 'edit') {
      if (task) {
        this.isAdd = false;
        this.taskSelected = task;
        this.taskName = task.title;
        this.taskDate = task.exprise;
        this.oldFilesSelected = task.files;
        this.headingDialog = 'Edit a task';
      }
    }
    setTimeout(() => {
      this.isShowAddTaskDialog = true;
    }, 500);
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  getUserSerssion() {
    this.userService.getUserSession().subscribe((user: User) => {
      this.userSession = user;
      this.getTasks();
    });
  }

  getTasks() {
    this.taskService
      .getTasksByUserID(this.userSession._id)
      .subscribe((data: Tasks[]) => {
        // this.tasks = data;
        this.listTaskDone = data.filter((task: Tasks) => task.completed);
        this.listTaskUnDone = data.filter((task: Tasks) => !task.completed);
      });
  }

  addTask() {
    if (this.taskName === '') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Type your task',
      });
      return;
    }
    if (!this.taskDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Type your exprise date time',
      });
      return;
    }
    this.taskService
      .addATask(this.taskName, this.taskDate, this.filesSelected)
      .subscribe((data: any) => {
        this.getTasks();
        this.clearTaskFiles();
        this.isShowAddTaskDialog = false;
        this.taskName = '';
        this.taskDate = '';
        this.messageService.add({
          severity: 'success',
          summary: data.message,
        });
      });
  }

  editTask() {
    console.log('filesSelected: ', this.filesSelected);
    console.log('this.taskSelected: ', this.taskSelected);
    const data = {
      title: this.taskName,
      exprise: this.taskDate,
    };
    this.taskService
      .editTask(
        this.filesSelected,
        this.oldFilesDeleted,
        data,
        this.taskSelected._id
      )
      .subscribe((data) => {
        console.log(`🚀 ~ editTask ~ data:`, data);
      });
  }

  handleForm() {
    if (this.headingDialog === 'Add a task') {
      this.addTask();
      console.log(`🚀 ~ handleForm ~ addTask:`);
    } else if (this.headingDialog === 'Edit a task') {
      this.editTask();
      console.log(`🚀 ~ handleForm ~ editTask:`);
    }
  }

  onDoneTask(taskID: string) {
    console.log(`🚀 ~ onDoneTask:`);

    this.taskService.doneTask(taskID).subscribe(
      () => {
        this.getTasks();
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

  onUnDoneTask(taskID: string) {
    console.log(`🚀 ~ onUnDoneTask:`);

    this.taskService.unDoneTask(taskID).subscribe(
      () => {
        this.getTasks();
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

  deleteTaskByID(taskID: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.taskService.deteleTaskByID(taskID).subscribe(
          (data: any) => {
            console.log(`🚀 ~ data:`, data);
            this.getTasks();
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
