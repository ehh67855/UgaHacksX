export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface ProjectVersion {
  id: number;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  userLogin: string;
  createdAt: Date;
}
