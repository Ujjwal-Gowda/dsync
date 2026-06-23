export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Workspace {
  id: number;
  name: string;
  ownerId: number;
  deletedAt: Date | null;
}

export interface WorkspaceMembers {
  workspaceId: number;
  userId: number;
  role: Role;
}

export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  workspaceId: number;
  createdById: number;
  deletedAt: Date | null;
}

enum ProjectStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export interface Task {
  id: number;
  title: string;
  description: string | null;

  status: Status;
  priority: Priority;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  projectId: number;
  createdById: number;
  assigneeId: number | null;
}

export enum Status {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  userId: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Activity {
  id: number;
  type: ActivityType;

  workspaceId: number;
  userId: number;

  taskId: number | null;
  projectId: number | null;

  metadata: unknown;
  createdAt: Date;
}
export enum ActivityType {
  TASK_CREATED = "TASK_CREATED",
  TASK_UPDATED = "TASK_UPDATED",
  TASK_DELETED = "TASK_DELETED",

  TASK_ASSIGNED = "TASK_ASSIGNED",
  TASK_STATUS_CHANGED = "TASK_STATUS_CHANGED",

  COMMENT_CREATED = "COMMENT_CREATED",
  COMMENT_UPDATED = "COMMENT_UPDATED",
  COMMENT_DELETED = "COMMENT_DELETED",

  PROJECT_CREATED = "PROJECT_CREATED",
  PROJECT_UPDATED = "PROJECT_UPDATED",
  PROJECT_DELETED = "PROJECT_DELETED",
}
