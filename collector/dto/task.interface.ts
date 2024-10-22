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
