import { api, APIError } from "encore.dev/api";
import { Status } from "../common/enums/status.interface";
import {
  ITask,
  ITaskConfig,
  ITaskLog,
  IUpdateTaskConfig,
} from "./dto/task.interface";
import {
  createTask,
  getTaskLogsByTaskId,
  getTasks,
  getTasksNeedToRun,
  saveTaskLog,
  updateTask,
  updateTaskConfig,
} from "./task.service";
import { IResponse } from "../common/dto/response.interface";
import { getNewsApi } from "../news/news.controller";

export const newsCollectorAPI = api({}, async (): Promise<IResponse> => {
  let finishedTaskCount = 0;
  const tasks: ITask[] = await getTasksNeedToRun();

  for await (const task of tasks) {
    await saveTaskLog({ taskId: task.code!, status: Status.IN_PROGRESS });
    try {
      await getNewsApi(task);
      await saveTaskLog({ taskId: task.code!, status: Status.DONE });
      finishedTaskCount++;
    } catch (error: any) {
      await saveTaskLog({
        taskId: task.code!,
        status: Status.FAILED,
        description: JSON.stringify(error),
      });
    }
  }

  return {
    message: `Total: ${
      tasks.length
    } with ${finishedTaskCount} tasks finished and ${
      tasks.length - finishedTaskCount
    } tasks failed`,
  };
});

export const createTaskAPI = api(
  {
    expose: true,
    method: "POST",
    path: "/task",
  },
  async (request: ITask): Promise<IResponse> => {
    const taskId = await createTask(request);
    return { message: `Task ${taskId} was created` };
  }
);

export const getTasksAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/task",
  },
  async (): Promise<{ tasks: ITaskConfig[] }> => {
    return { tasks: await getTasks() };
  }
);

export const updateTaskAPI = api(
  {
    expose: true,
    method: "PUT",
    path: "/task",
  },
  async (request: ITask): Promise<IResponse> => {
    await updateTask(request);
    return { message: "Task updated" };
  }
);

export const updateTaskConfigAPI = api(
  {
    expose: true,
    method: "PUT",
    path: "/task/config",
  },
  async (request: IUpdateTaskConfig): Promise<IResponse> => {
    await updateTaskConfig(request);
    return { message: "Task config updated" };
  }
);

export const getTaskLogByTaskIdAPI = api(
  {
    expose: true,
    method: "GET",
    path: "/task/log/:id/:date",
  },
  async (params: {
    id: string;
    date: string;
  }): Promise<{ logs: ITaskLog[] }> => {
    return { logs: await getTaskLogsByTaskId(params.id, params.date) };
  }
);
