import { Status } from "../../common/enums/status.interface";

export interface ITaskLog {
  taskId: string;
  status: Status;
}
