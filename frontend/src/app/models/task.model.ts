import { PickType } from 'chart.js/dist/types/utils';

export interface Task {
  _id: string;
  userID: string;
  title: string;
  completed: boolean;
  exprise: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskEdit extends Pick<Task, 'title' | 'exprise'> {}
