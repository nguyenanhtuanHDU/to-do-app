export interface Task {
  _id: string;
  userID: string;
  // projectID: string;
  title: string;
  color: string;
  completed: boolean;
  exprise: string;
  files: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskEdit extends Pick<Task, 'title' | 'exprise' | 'color'> {}
