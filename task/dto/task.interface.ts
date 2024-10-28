import { Status } from "../../common/enums/status.interface";

export interface ITask {
  code?: string;
  name: string;
  description: string;
  categoryId: number;
  newsSourceId: number;
}

export interface ITaskConfig {
  taskId: string;
  name: string;
  category: string;
  source: string;
  isEnabled: boolean;
  runAt: number;
}

export interface IUpdateTaskConfig {
  taskId: string;
  isEnabled: boolean;
  runAt: number;
}

export interface ITaskLog {
  taskId: string;
  status: Status;
  description?: string;
}
