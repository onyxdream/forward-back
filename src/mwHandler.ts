import path from "path";
import fs from "fs";
import app from ".";
import { AppMethod, MiddlewareRecord } from "./types";

const middlewarePath = path.join(process.cwd(), "dist", "middleware");

function isMethod(str: string): str is AppMethod {
  return ["put", "delete", "get", "post"].includes(str);
}

export const initMiddleware = () => {
  console.log(`[+] Loading middleware:`);

  for (const file of fs.readdirSync(middlewarePath)) {
    const filePath = path.join(middlewarePath, file);
    const fileExports = require(filePath);
    const middlewareFunctions: MiddlewareRecord = fileExports?.default;

    if (!middlewareFunctions) {
      console.log(
        `[!] Cannot find any default export for ${file}, skipping...`
      );
      continue;
    }

    Object.entries(middlewareFunctions).forEach(([key, handler]) => {
      let [method, _path] = key.split(" ");

      if (!isMethod(method)) return;

      console.log(`- ${method.toUpperCase()}: ${_path}`);

      // Express expects a RequestHandler; our handler type may return values so cast it
      app[method](
        _path,
        handler as unknown as import("express").RequestHandler
      );
    });
  }
};
