import { buildRouePath } from "./utils/build-route-path.js";
import { randomUUID } from "node:crypto";
import { Database } from "./database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRouePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRouePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title and description is missing!",
          }),
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      database.insert("tasks", task);

      return res.end(JSON.stringify(task));
    },
  },
  {
    method: "PUT",
    path: buildRouePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title and description is missing!",
          }),
        );
      }

      // let it change
      let task = database.select("tasks", {
        id,
      });

      if (!task.length) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Task not found",
          }),
        );
      }

      task = {
        ...task[0],
        title,
        description,
        updated_at: new Date().toISOString(),
      };

      database.update("tasks", id, task);

      return res.end(JSON.stringify(task));
    },
  },
  {
    method: "DELETE",
    path: buildRouePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      let task = database.select("tasks", {
        id,
      });

      if (!task.length) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Task not found",
          }),
        );
      }

      database.delete("tasks", id);

      return res.end(
        JSON.stringify({
          message: "Task deleted successfully",
        }),
      );
    },
  },
  {
    method: "PATCH",
    path: buildRouePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      let task = database.select("tasks", {
        id,
      });

      if (!task.length) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Task not found",
          }),
        );
      }

      task = {
        ...task[0],
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      database.update("tasks", id, task);

      return res.end(
        JSON.stringify({
          message: "Task completed successfully",
        }),
      );
    },
  },
];

// CRIAR O UPLOAD
