import { api } from "encore.dev/api";
import { Status } from "../common/enums/status.interface";
import { ITask } from "./dto/task.interface";
import { createTask, saveTaskLog } from "./collector.service";
import { IResponse } from "../common/dto/response.interface";

export const newsColelctor = api({}, async (): Promise<IResponse> => {
  const task: ITask = {
    name: "Send welcome emails",
    description: "Send welcome emails to users",
    categoryId: 1,
    newsSourceId: 1,
  };

  const taskId = await createTask(task);
  saveTaskLog({ taskId: taskId, status: Status.DONE });

  return { message: `Task ${taskId} was stopped with status ${Status.DONE}` };
});
