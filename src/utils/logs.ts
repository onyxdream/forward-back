import { query } from "../config/db";

type Action =
  | "CreateUser"
  | "UpdateUser"
  | "DeleteUser"
  | "LoginUser"
  | "LogoutUser"
  | "CreatePost"
  | "UpdatePost"
  | "DeletePost"
  | "CreateComment"
  | "UpdateComment"
  | "DeleteComment"
  | "UploadFile"
  | "DeleteFile"
  | "UpdateSettings"
  | "ChangePassword"
  | "ResetPassword";

const actionMessages: Record<Action, string> = {
  CreateUser: "User created",
  UpdateUser: "User updated",
  DeleteUser: "User deleted",
  LoginUser: "User logged in",
  LogoutUser: "User logged out",
  CreatePost: "Post created",
  UpdatePost: "Post updated",
  DeletePost: "Post deleted",
  CreateComment: "Comment created",
  UpdateComment: "Comment updated",
  DeleteComment: "Comment deleted",
  UploadFile: "File uploaded",
  DeleteFile: "File deleted",
  UpdateSettings: "Settings updated",
  ChangePassword: "Password changed",
  ResetPassword: "Password reset",
};

interface AuditLogDetails {
  [key: string]: any;
}

interface AuditLog {
  action: Action;
  actorId: string;
  targetId: string | null;
  details?: AuditLogDetails;
}

const insertLog = async ({
  action,
  actorId,
  targetId,
  details = {},
}: AuditLog) => {
  await query(
    "INSERT INTO f0_audit_log (action, actor_id, target_id, details) VALUES ($1, $2, $3, $4)",
    [action, actorId, targetId, JSON.stringify(details)]
  );
};

class Audit {
  private static consoleLogMessage = (
    { action, details, actorId, targetId }: AuditLog,
    icon: string
  ) => {
    const message = actionMessages[action];
    const detailsField = `\n | Info: ${JSON.stringify({
      ...details,
      actorId,
      targetId,
    })}`;

    console.log(
      `[${icon}] ${new Date().toISOString()}: ${message}${detailsField}`
    );
  };

  static log(log: AuditLog) {
    insertLog(log);
    this.consoleLogMessage(log, "ℹ️");
  }

  static warn(log: AuditLog) {
    insertLog(log);
    this.consoleLogMessage(log, "⚠️");
  }
}

export default Audit;
