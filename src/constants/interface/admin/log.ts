export interface Log {
  id: string;
  activityType: string;
  action: string;
  performedBy: string;
  targetEntity: string;
  targetId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: string;
  description: string;
  details?: Record<string, any>;
  module: string;
  severity: string;
}
