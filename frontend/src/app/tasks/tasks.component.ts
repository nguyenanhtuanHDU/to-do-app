import { Component, ViewChild } from '@angular/core';
import { TaskService } from '../services/task.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Task } from '../models/task.model';
import { environment } from 'src/environments/environment.development';
import { SwiperOptions } from 'swiper';

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

  apiBackendRoot = environment.apiBackendRoot;
  // apiBackend = environment.apiBackend;
  imgSrc = this.apiBackendRoot + 'tasks/';
  isShowAddTaskDialog: boolean = false;
  taskSelected!: Task;
  taskName: string = '';
  taskDate: string = '';
  userSession!: User;
  // tasks: Tasks[] = [];
  listTaskDone: Task[] = [];
  listTaskUnDone: Task[] = [];
  listImageViews: string[] = [];
  currentDate = new Date();
  headingDialog: string = '';
  filesSelected: any[] = [];
  oldFilesSelected: string[] = [];
  oldFilesDeleted: string[] = [];
  isAdd!: boolean;
  config: SwiperOptions = {
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    autoHeight: true,
    allowTouchMove: true,
    slidesPerView: 1,
    spaceBetween: 20,
  };

  showGalleryImages(images: string[]) {
    this.listImageViews = images.map((item) => this.imgSrc + item);
  }

  selectFileTasks(event: any) {
    this.filesSelected = event.currentFiles;
  }

  clearTaskFiles() {
    this.fileUpload.clear();
    this.filesSelected = [];
  }

  chooseOldFileDeleted(fileName: string, index: number) {
    this.confirmationService.confirm({
      message: 'Do you want to to delete this image?',
      icon: 'pi pi-question',
      accept: () => {
        if (!this.oldFilesDeleted.includes(fileName)) {
          this.oldFilesDeleted.push(fileName);
          this.oldFilesSelected.splice(
            this.oldFilesSelected.indexOf(fileName),
            1
          );
        }
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

  deleteImgSelected(index: number) {
    this.filesSelected.splice(index, 1);
  }

  showAddTaskDialog(type: string, task: Task | null) {
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

  closeAddTaskDialog() {
    this.taskName = '';
    this.taskDate = '';
    this.oldFilesSelected = [];
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
      .subscribe((data: Task[]) => {
        // this.tasks = data;
        this.listTaskDone = data.filter((task: Task) => task.completed);
        this.listTaskUnDone = data.filter((task: Task) => !task.completed);
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
          summary: 'Success',
          detail: data.message,
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
      .subscribe((data) => {});
  }

  handleForm() {
    if (this.headingDialog === 'Add a task') {
      this.addTask();
    } else if (this.headingDialog === 'Edit a task') {
      this.editTask();
    }
  }

  onDoneTask(taskID: string) {
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
      message: 'Do you want to to delete this task?',
      icon: 'pi pi-question',
      accept: () => {
        this.taskService.deteleTaskByID(taskID).subscribe(
          (data: any) => {
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
