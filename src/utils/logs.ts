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

/**
 * Audit logging utility class for tracking and recording user actions and system events.
 * 
 * This class provides methods to log audit events with different severity levels.
 * All logs are persisted via the `insertLog` function and also output to the console
 * with formatted messages and icons.
 * 
 * @remarks
 * The class uses static methods and should not be instantiated.
 * 
 * @example
 * ```typescript
 * Audit.log({
 *   action: 'USER_LOGIN',
 *   details: { ip: '192.168.1.1' },
 *   actorId: 'user123',
 *   targetId: 'session456'
 * });
 * 
 * Audit.warn({
 *   action: 'INVALID_ACCESS_ATTEMPT',
 *   details: { reason: 'Insufficient permissions' },
 *   actorId: 'user789',
 *   targetId: 'resource001'
 * });
 * ```
 */
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
