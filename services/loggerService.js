import { ActionLog } from "../models/index.js";

export async function logAction({
    action,
    details,
    userId,
    targetId = null,
    targetType = null,
    ipAddress = null
  }) {
    try {
      await ActionLog.create({
        action,
        details,
        userId,
        targetId,
        targetType,
        ipAddress,
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }