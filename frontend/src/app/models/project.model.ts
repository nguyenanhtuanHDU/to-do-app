export interface Project {
  _id: string;
  userID: string;
  title: string;
  color: string;
}

export interface ProjectCreate extends Omit<Project, '_id'> {}
